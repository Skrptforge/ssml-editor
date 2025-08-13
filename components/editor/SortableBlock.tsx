"use client";

import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";
import { BlockComponent } from "./Block";
import type { Block } from "@/lib/types";
import { BlockSelectCheckbox } from "./BlockSelectCheckbox";

interface SortableBlockProps {
  block: Block;
  isSelected: boolean;
  onChange: (id: string, updates: Partial<Omit<Block, "id">>) => void;
  onKeyDown: (e: React.KeyboardEvent, id: string) => void;
  onPlay: (block: Block) => void;
  onFocus: (id: string) => void;
  onDelete: (id: string) => void;
}

export function SortableBlock(props: SortableBlockProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: props.block.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 1 : 0,
  };

  return (
    <div ref={setNodeRef} style={style} className="flex items-center gap-2">
      <BlockSelectCheckbox blockId={props.block.id} />
      <div className="relative w-full">
        <BlockComponent {...props} />
        <div className="absolute left-1 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
          <button
            className="flex-shrink-0 w-6 h-6 rounded-full 
                   flex items-center justify-center cursor-grab
                   hover:bg-white/5 transition-all duration-200 
                   active:cursor-grabbing"
            {...attributes}
            {...listeners}
          >
            <GripVertical className="w-3 h-3 " />
          </button>
        </div>
      </div>
    </div>
  );
}
