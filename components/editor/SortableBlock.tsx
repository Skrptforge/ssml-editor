"use client";

import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Trash2 } from 'lucide-react';
import { BlockComponent } from './Block';
import type { Block } from '@/lib/types';

interface SortableBlockProps {
  block: Block;
  isSelected: boolean;
  onChange: (id: string, text: string) => void;
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
    <div ref={setNodeRef} style={style} className="relative">
      <BlockComponent {...props} />
      <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
        <button
          onClick={() => props.onDelete(props.block.id)}
          className="flex-shrink-0 w-6 h-6 rounded-full border border-white/20 
                   flex items-center justify-center
                   hover:bg-red-500/20 hover:border-red-500/50 transition-all duration-200"
          aria-label="Delete block"
        >
          <Trash2 className="w-3 h-3 text-white/80" />
        </button>
        <button 
          className="flex-shrink-0 w-6 h-6 rounded-full border border-white/20
                   flex items-center justify-center cursor-grab
                   hover:bg-white/5 transition-all duration-200 
                   active:cursor-grabbing"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="w-3 h-3 text-white/40" />
        </button>
      </div>
    </div>
  );
}
