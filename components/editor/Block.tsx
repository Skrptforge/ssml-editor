"use client";

import React, { useEffect, useRef } from "react";
import { Block } from "@/lib/types";
import { Play, Trash2 } from "lucide-react";

interface BlockProps {
  block: Block;
  isSelected: boolean;
  onChange: (id: string, text: string) => void;
  onKeyDown: (e: React.KeyboardEvent, id: string) => void;
  onPlay: (block: Block) => void;
  onFocus: (id: string) => void;
  onDelete: (id: string) => void;
}

export function BlockComponent({
  block,
  isSelected,
  onChange,
  onKeyDown,
  onPlay,
  onFocus,
  onDelete,
}: BlockProps) {
  const contentRef = useRef<HTMLDivElement>(null);

  // Focus the block and set cursor at the beginning when selected
  useEffect(() => {
    if (isSelected && contentRef.current) {
      contentRef.current.focus();
      const selection = window.getSelection();
      const range = document.createRange();
      
      if (contentRef.current.firstChild) {
        range.setStart(contentRef.current.firstChild, 0);
        range.setEnd(contentRef.current.firstChild, 0);
      } else {
        range.setStart(contentRef.current, 0);
        range.setEnd(contentRef.current, 0);
      }
      
      selection?.removeAllRanges();
      selection?.addRange(range);
    }
  }, [isSelected]);

  // Sync content from props to contentEditable
  useEffect(() => {
    if (contentRef.current && contentRef.current.textContent !== block.text) {
      contentRef.current.textContent = block.text;
    }
  }, [block.text]);

  const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
    const newText = e.currentTarget.textContent || "";
    onChange(block.id, newText);
  };

  return (
    <div
      className={`flex items-center gap-2 py-2 px-4 pr-24 rounded-md transition-colors ${
        isSelected ? "bg-white/5" : "hover:bg-white/[0.03]"
      }`}
    >
      <button
        onClick={() => onPlay(block)}
        className="flex-shrink-0 w-6 h-6 rounded-full border border-white/20 
                 flex items-center justify-center
                 hover:bg-white/10 transition-all duration-200"
        aria-label="Play block"
      >
        <Play className="w-3 h-3 text-white/80" />
      </button>
     

      <div
        ref={contentRef}
        contentEditable
        onInput={handleInput}
        onKeyDown={(e) => onKeyDown(e, block.id)}
        onFocus={() => onFocus(block.id)}
        className={`flex-1 outline-none min-h-[1.5em] text-base leading-[1.6] py-0.5 ${
          !block.text
            ? "before:content-[attr(data-placeholder)] before:text-white/30"
            : "text-white/80"
        }`}
        style={{ wordBreak: "break-word" }}
        data-placeholder="Write here..."
      />
    </div>
  );
}
