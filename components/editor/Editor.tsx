"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
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
import Toolbar from "./Toolbar";

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
    <motion.div 
      className="w-4xl mt-5 mx-auto px-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.6, 
        ease: "easeOut",
        staggerChildren: 0.1,
        delayChildren: 0.2
      }}
    >
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={blocks.map((block) => block.id)}
          strategy={verticalListSortingStrategy}
        >
          <motion.div 
            className="space-y-0.5 relative"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.08
                }
              }
            }}
            initial="hidden"
            animate="visible"
          >
            <AnimatePresence>
              {blocks.map((block, index) => (
                <motion.div
                  key={block.id}
                  variants={{
                    hidden: { 
                      opacity: 0, 
                      y: 20, 
                      scale: 0.95 
                    },
                    visible: { 
                      opacity: 1, 
                      y: 0, 
                      scale: 1,
                      transition: {
                        type: "spring",
                        stiffness: 300,
                        damping: 24,
                        delay: index * 0.05
                      }
                    }
                  }}
                  initial="hidden"
                  animate="visible"
                  exit={{ 
                    opacity: 0, 
                    y: -20, 
                    scale: 0.95,
                    transition: { duration: 0.3 }
                  }}
                  layout
                >
                  <SortableBlock
                    block={block}
                    isSelected={block.id === selectedBlockId}
                    onChange={updateBlock}
                    onKeyDown={handleKeyDown}
                    onPlay={playBlock}
                    onFocus={(id) => setSelectedBlock(id)}
                    onDelete={deleteBlock}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </SortableContext>
      </DndContext>
    </motion.div>
  );
}
