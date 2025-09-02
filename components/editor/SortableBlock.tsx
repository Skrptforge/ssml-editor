"use client";

import React, { memo } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";
import { BlockComponent } from "./Block";
import type { Block } from "@/lib/types/block";
import { FactCheckCorrection } from "@/utils/parsing";
import { CorrectionPanel } from "./CorrectionPanel";

interface SortableBlockProps {
  block: Block;
  isSelected: boolean;
  onChange: (id: string, updates: Partial<Omit<Block, "id">>) => void;
  onKeyDown: (e: React.KeyboardEvent, id: string) => void;
  onPlay: (block: Block) => void;
  onFocus: (id: string) => void;
  onDelete: (id: string) => void;
  corrections?: FactCheckCorrection[];
}

export const SortableBlock = memo<SortableBlockProps>((props: SortableBlockProps) => {
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

  const handleApplyCorrection = (correction: FactCheckCorrection) => {
    props.onChange(props.block.id, { text: correction.updatedContent });
  };

  return (
    <div ref={setNodeRef} style={style} className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <div className="relative w-full">
          <BlockComponent
            block={props.block}
            isSelected={props.isSelected}
            onChange={props.onChange}
            onKeyDown={props.onKeyDown}
            onPlay={props.onPlay}
            onFocus={props.onFocus}
            onDelete={props.onDelete}
          />
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

      {/* Correction Panel */}
      <CorrectionPanel
        corrections={props.corrections || []}
        blockId={props.block.id}
        onApplyCorrection={handleApplyCorrection}
      />
    </div>
  );
}, (prevProps, nextProps) => {
  // Custom comparison function - only re-render if relevant props change
  const prevBlockCorrections = prevProps.corrections?.filter(c => c.blockId === prevProps.block.id) || [];
  const nextBlockCorrections = nextProps.corrections?.filter(c => c.blockId === nextProps.block.id) || [];

  return (
    prevProps.block === nextProps.block &&
    prevProps.isSelected === nextProps.isSelected &&
    JSON.stringify(prevBlockCorrections) === JSON.stringify(nextBlockCorrections)
  );
});

SortableBlock.displayName = "SortableBlock";
