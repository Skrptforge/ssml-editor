"use client";

import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
  useMemo,
} from "react";
import { useEditorStore } from "@/lib/store";
import { SortableBlock } from "./SortableBlock";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DndContext,
  DragEndEvent,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

export function Editor() {
  const [isMounted, setIsMounted] = useState(false);
  const BLOCKS_PER_PAGE = 10;

  const {
    blocks,
    selectedBlockId,
    currentPage,
    corrections,
    actions: {
      updateBlock,
      createBlock,
      mergeWithPrevious,
      deleteBlock,
      setSelectedBlock,
      reorderBlocks,
      setCurrentPage,
    },
  } = useEditorStore();
  const lastEnterTime = useRef(0);
  const DEBOUNCE_DELAY = 100;
  const debouncedCreateBlock = useCallback(
    (id: string, content: string, position: number) => {
      const now = Date.now();
      if (now - lastEnterTime.current >= DEBOUNCE_DELAY) {
        createBlock(id, content, position);
        lastEnterTime.current = now;
      }
    },
    [createBlock]
  );
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        // Only start dragging after moving 8px to prevent accidental drags
        distance: 8,
      },
    })
  );

  // Ensure component is mounted before rendering DnD components
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Calculate pagination
  const totalPages = Math.ceil(blocks.length / BLOCKS_PER_PAGE);
  const startIndex = (currentPage - 1) * BLOCKS_PER_PAGE;
  const endIndex = startIndex + BLOCKS_PER_PAGE;
  const currentBlocks = useMemo(
    () => blocks.slice(startIndex, endIndex),
    [blocks, startIndex, endIndex]
  );

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      reorderBlocks(active.id as string, over.id as string);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, id: string) => {
    const selection = window.getSelection();
    const cursorPosition = selection?.focusOffset || 0;

    // Handle arrow key navigation
    if (e.key === "ArrowUp" || e.key === "ArrowDown") {
      const currentIndex = blocks.findIndex((b) => b.id === id);
      const selection = window.getSelection();
      const range = selection?.getRangeAt(0);

      // Caret position in the current editable block
      const isAtStart = range?.startOffset === 0 && range?.collapsed;
      const isAtEnd =
        range?.endOffset === e.currentTarget.textContent.length &&
        range?.collapsed;

      if (e.key === "ArrowUp" && isAtStart && currentIndex > 0) {
        e.preventDefault();
        const prevBlock = blocks[currentIndex - 1];
        setSelectedBlock(prevBlock.id);
      } else if (
        e.key === "ArrowDown" &&
        isAtEnd &&
        currentIndex < blocks.length - 1
      ) {
        e.preventDefault();
        const nextBlock = blocks[currentIndex + 1];
        setSelectedBlock(nextBlock.id);
      }
    }

    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      // Create new block and split text at cursor position
      debouncedCreateBlock(id, "", cursorPosition);
    } else if (e.key === "Backspace") {
      const block = blocks.find((b) => b.id === id);
      const selection = window.getSelection();
      const isAtStart = selection?.anchorOffset === 0;

      if (block?.text === "") {
        e.preventDefault();
        // Only merge if there's a previous block
        const index = blocks.findIndex((b) => b.id === id);
        if (index > 0) {
          mergeWithPrevious(id);
          const prevBlock = blocks[index - 1];
          setSelectedBlock(prevBlock.id);
        } else if (blocks.length > 1) {
          // If it's the first block and empty, delete it if there are other blocks
          deleteBlock(id);
          const nextBlock = blocks[1];
          setSelectedBlock(nextBlock.id);
        }
      } else if (isAtStart) {
        // If cursor is at start of non-empty block, merge with previous
        const index = blocks.findIndex((b) => b.id === id);
        if (index > 0) {
          e.preventDefault();
          mergeWithPrevious(id);
          const prevBlock = blocks[index - 1];
          setSelectedBlock(prevBlock.id);
        }
      }
    }
  };

  const playBlock = (block: { id: string; text: string }) => {
    // Simple console log instead of speech synthesis
    console.log("Playing block:", block.text);
  };

  // Render fallback during hydration to prevent mismatch
  if (!isMounted) {
    return (
      <div className="max-w-3xl mx-auto px-4">
        <div className="space-y-0.5 relative">
          {currentBlocks.map((block) => (
            <SortableBlock
              key={block.id}
              block={block}
              isSelected={block.id === selectedBlockId}
              onChange={updateBlock}
              onKeyDown={handleKeyDown}
              onPlay={playBlock}
              onFocus={(id) => setSelectedBlock(id)}
              onDelete={deleteBlock}
              corrections={corrections}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-4xl mt-1 mx-auto px-4 pb-20">
      {/* Pagination Header */}
      {totalPages > 1 && (
        <div className="flex items-center mb-2 justify-between pb-1 border-b border-border">
          <div></div>
          <div className="flex items-center gap-2">
            <Button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              variant="outline"
              size="icon"
              className="cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="text-sm text-muted-foreground">
              {currentPage} / {totalPages}
            </span>
            <Button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              variant="outline"
              size="icon"
              className="cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={currentBlocks.map((block) => block.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-0.5 relative">
            {currentBlocks.map((block) => (
              <SortableBlock
                key={block.id}
                block={block}
                isSelected={block.id === selectedBlockId}
                onChange={updateBlock}
                onKeyDown={handleKeyDown}
                onPlay={playBlock}
                onFocus={(id) => setSelectedBlock(id)}
                onDelete={deleteBlock}
                corrections={corrections}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}
