"use client";

import React, { useEffect, useRef, useState } from "react";
import { Block } from "@/lib/types/block";
import { Play } from "lucide-react";
import { SSMLOptionsMenu } from "./SSMLOptionsMenu";
import { generateBlockStyles } from "@/lib/utils";
import { clear } from "console";

interface BlockProps {
  block: Block;
  isSelected: boolean;
  onChange: (id: string, updates: Partial<Omit<Block, "id">>) => void;
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
}: BlockProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const { className } = generateBlockStyles(block);
  const [localtext, setlocaltext] = useState(block.text);
  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(block.id, { text: localtext });
    }, 50);
    return () => clearTimeout(timeout);
  }, [block.id, localtext, onChange]);
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
    setlocaltext(newText);
  };
  return (
    <div
      className={`flex flex-col gap-2 px-4 py-1 cursor-pointer rounded-md transition-colors ${
        isSelected ? "bg-muted" : "hover:bg-muted/50"
      }`}
    >
      <div className="flex items-center gap-2">
        <button
          onClick={() => onPlay(block)}
          className="flex-shrink-0 w-6 h-6 ml-3 rounded-full border border-border 
                   flex items-center justify-center hover:bg-muted transition-all duration-200"
          aria-label="Play block"
        >
          <Play className="w-3 h-3 text-foreground/80" />
        </button>

        <div
          ref={contentRef}
          contentEditable
          onInput={handleInput}
          onKeyDown={(e) => onKeyDown(e, block.id)}
          onFocus={() => onFocus(block.id)}
          className={`flex-1 outline-none min-h-[1.5em] text-base leading-[1.6] py-0.5 ${
            !localtext
              ? "before:content-[attr(data-placeholder)] before:text-muted-foreground"
              : "text-foreground/80"
          } ${className}`}
          style={{ wordBreak: "break-word" }}
          data-placeholder="Write here..."
        />

        <SSMLOptionsMenu
          block={block}
          onChange={(updates) => onChange(block.id, updates)}
        />
      </div>
    </div>
  );
}
