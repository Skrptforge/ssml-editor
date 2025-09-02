"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
// using native textarea instead of Input
import { Button } from "@/components/ui/button";
import { IconPlus, IconArrowRight, IconLoader } from "@tabler/icons-react";
import { useEditScript } from "@/lib/hooks/useAiScript";
import useFactCheck from "@/lib/hooks/useFactCheck";

interface ExpandingTextboxProps {
  placeholder?: string;
  onSubmit?: (value: string) => void;
  className?: string;
  id: string;
}

export const ExpandingTextbox: React.FC<ExpandingTextboxProps> = ({
  placeholder = "modify script",
  onSubmit,
  className = "",
  id,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [value, setValue] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);

  const { mutateAsync } = useEditScript();
  const handleEditScript = async () => {
    if (value.trim().length === 0) return;

    setIsLoading(true);
    try {
      await mutateAsync({ prompt: value.trim(), id });
      if (onSubmit) onSubmit(value.trim());
      setValue("");
      requestAnimationFrame(adjustHeight);
    } catch (error) {
      console.error("Error editing script:", error);
    } finally {
      setIsLoading(false);
    }
  };
  // adjust textarea height to remove scrollbar
  const adjustHeight = () => {
    const ta = inputRef.current;
    if (!ta) return;
    const MAX_HEIGHT = 90; // px, cap the height
    ta.style.height = "auto"; // reset to get correct scrollHeight
    const desired = ta.scrollHeight;
    if (desired > MAX_HEIGHT) {
      ta.style.height = `${MAX_HEIGHT}px`;
      ta.style.overflow = "auto"; // allow internal scrolling once capped
    } else {
      ta.style.height = `${desired}px`;
      ta.style.overflow = "hidden"; // hide scrollbar when under cap
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      // Regular Enter submits (Shift+Enter for new line)
      e.preventDefault();
      handleEditScript();
    }
  };

  const handleSubmit = async () => {
    await handleEditScript();
  };

  const handlePlus = () => {
    inputRef.current?.focus();
  };

  useEffect(() => {
    adjustHeight();
  }, []);
  const { mutateAsync: factCheck } = useFactCheck();
  return (
    <motion.div
      className={`
        fixed bottom-6 left-1/2 transform -translate-x-1/2 z-40
        ${className}
      `}
      animate={{
        width: isFocused ? 500 : 300,
      }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 30,
        duration: 0.3,
      }}
      initial={false}
    >
      {/* Minimal glassmorphism container */}
      <div
        className={`
          flex items-center gap-3 px-2 py-1  rounded-3xl
          bg-white/10 dark:bg-white/5
          backdrop-blur-lg backdrop-saturate-150
          border border-white/20 dark:border-white/10
          shadow-lg shadow-black/5 dark:shadow-black/20
          ${
            isFocused
              ? "bg-white/15 dark:bg-white/8 border-white/30 dark:border-white/15"
              : ""
          }
          transition-all duration-300 ease-out
        `}
      >
        {/* Minimal glassmorphic button */}
        <Button
          variant="ghost"
          size="icon"
          disabled={isLoading}
          className="
            h-8 w-8 p-0 rounded-full
            bg-white/10 hover:bg-white/20 dark:bg-white/5 dark:hover:bg-white/10
            border border-white/20 hover:border-white/30 dark:border-white/10 dark:hover:border-white/20
            backdrop-blur-sm
            text-black/60 hover:text-black/80 dark:text-white/60 dark:hover:text-white/80
            transition-all duration-200
            disabled:opacity-50 disabled:cursor-not-allowed
          "
          aria-label="Add"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => factCheck()}
          title="Add"
        >
          <IconPlus className="h-4 w-4" />
        </Button>

        {/* Textarea */}
        <textarea
          ref={inputRef}
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            requestAnimationFrame(adjustHeight);
          }}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={isLoading}
          rows={1}
          className="
            flex-1 resize-none min-h-[40px] px-4 py-2 rounded-full
            bg-transparent
            text-center placeholder:text-center
            text-foreground/80 placeholder:text-foreground/40
            outline-none focus:outline-none ring-0 focus:ring-0 focus-visible:outline-none
            disabled:opacity-50 disabled:cursor-not-allowed
          "
        />

        {/* Submit button */}
        <Button
          variant="ghost"
          size="icon"
          disabled={isLoading || value.trim().length === 0}
          className="h-8 w-8 p-0 text-foreground/60 hover:text-foreground/80 rounded-full transition-colors disabled:opacity-50"
          aria-label={isLoading ? "Processing..." : "Submit"}
          onMouseDown={(e) => e.preventDefault()}
          onClick={handleSubmit}
          title={isLoading ? "Processing..." : "Submit"}
        >
          {isLoading ? (
            <IconLoader className="h-4 w-4 animate-spin" />
          ) : (
            <IconArrowRight className="h-4 w-4" />
          )}
        </Button>
      </div>
    </motion.div>
  );
};

export default ExpandingTextbox;
