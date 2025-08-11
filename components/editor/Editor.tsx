"use client";

import React, { useEffect, useState } from "react";
import { useEditorStore } from "@/lib/store";
import { SortableBlock } from "./SortableBlock";
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
  
  const {
    blocks,
    selectedBlockId,
    actions: {
      updateBlock,
      createBlock,
      mergeWithPrevious,
      deleteBlock,
      setSelectedBlock,
      setSpeaking,
      reorderBlocks,
    },
  } = useEditorStore();
  
  console.log(blocks);
  
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

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      reorderBlocks(active.id as string, over.id as string);
    }
  };

  // Stop any ongoing speech when switching blocks
  useEffect(() => {
    return () => {
      speechSynthesis.cancel();
    };
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent, id: string) => {
    const selection = window.getSelection();
    const cursorPosition = selection?.focusOffset || 0;

    // Handle arrow key navigation
    if (e.key === "ArrowUp" || e.key === "ArrowDown") {
      const currentIndex = blocks.findIndex((b) => b.id === id);

      if (e.key === "ArrowUp" && currentIndex > 0) {
        e.preventDefault();
        const prevBlock = blocks[currentIndex - 1];
        setSelectedBlock(prevBlock.id);
      } else if (e.key === "ArrowDown" && currentIndex < blocks.length - 1) {
        e.preventDefault();
        const nextBlock = blocks[currentIndex + 1];
        setSelectedBlock(nextBlock.id);
      }
      return;
    }

    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      // Create new block and split text at cursor position
      createBlock(id, "", cursorPosition);
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

  const playBlock = async (block: { id: string; text: string }) => {
    // Stop any ongoing speech
    speechSynthesis.cancel();
    setSpeaking(false);

    if (block.text.trim() === "") return;

    const utterance = new SpeechSynthesisUtterance(block.text);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    utterance.onstart = () => setSpeaking(true);
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);

    speechSynthesis.speak(utterance);
  };

  // Render fallback during hydration to prevent mismatch
  if (!isMounted) {
    return (
      <div className="max-w-3xl mx-auto px-4">
        <div className="space-y-0.5 relative">
          {blocks.map((block) => (
            <SortableBlock
              key={block.id}
              block={block}
              isSelected={block.id === selectedBlockId}
              onChange={updateBlock}
              onKeyDown={handleKeyDown}
              onPlay={playBlock}
              onFocus={(id) => setSelectedBlock(id)}
              onDelete={deleteBlock}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={blocks.map((block) => block.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-0.5 relative">
            {blocks.map((block) => (
              <SortableBlock
                key={block.id}
                block={block}
                isSelected={block.id === selectedBlockId}
                onChange={updateBlock}
                onKeyDown={handleKeyDown}
                onPlay={playBlock}
                onFocus={(id) => setSelectedBlock(id)}
                onDelete={deleteBlock}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}