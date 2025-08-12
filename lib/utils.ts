import { Block, BlockStyles } from "@/lib/types";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateBlockStyles(block: Block): BlockStyles {
  let className = "";
  const indicators: BlockStyles["indicators"] = {};

  // Base classes
  className += "transition-all duration-200 ";

  // Emphasis styles
  if (block.emphasis) {
    switch (block.emphasis.level) {
      case "strong":
        className += "font-bold text-foreground ";
        indicators.emphasis = "STRONG";
        break;
      case "moderate":
        className += "font-semibold text-foreground/90 ";
        indicators.emphasis = "MODERATE";
        break;
      case "reduced":
        className += "font-light text-foreground/60 ";
        indicators.emphasis = "REDUCED";
        break;
    }
  }

  // Prosody styles
  if (block.prosody) {
    const prosodyIndicators: string[] = [];

    // Rate styles
    if (block.prosody.rate) {
      switch (block.prosody.rate) {
        case "x-slow":
          className += "tracking-widest ";
          prosodyIndicators.push("X-SLOW");
          break;
        case "slow":
          className += "tracking-wide ";
          prosodyIndicators.push("SLOW");
          break;
        case "medium":
          className += "tracking-normal ";
          prosodyIndicators.push("MEDIUM");
          break;
        case "fast":
          className += "tracking-tight ";
          prosodyIndicators.push("FAST");
          break;
        case "x-fast":
          className += "tracking-tighter ";
          prosodyIndicators.push("X-FAST");
          break;
      }
    }

    // Pitch styles (using color variations)
    if (block.prosody.pitch) {
      switch (block.prosody.pitch) {
        case "x-low":
          className += "text-red-600 dark:text-red-400 ";
          prosodyIndicators.push("X-LOW");
          break;
        case "low":
          className += "text-orange-600 dark:text-orange-400 ";
          prosodyIndicators.push("LOW");
          break;
        case "medium":
          className += "text-foreground ";
          prosodyIndicators.push("MED");
          break;
        case "high":
          className += "text-blue-600 dark:text-blue-400 ";
          prosodyIndicators.push("HIGH");
          break;
        case "x-high":
          className += "text-purple-600 dark:text-purple-400 ";
          prosodyIndicators.push("X-HIGH");
          break;
      }
    }

    // Volume styles
    if (block.prosody.volume) {
      switch (block.prosody.volume) {
        case "silent":
          className += "opacity-20 line-through ";
          prosodyIndicators.push("SILENT");
          break;
        case "x-soft":
          className += "opacity-40 text-sm ";
          prosodyIndicators.push("X-SOFT");
          break;
        case "soft":
          className += "opacity-70 text-sm ";
          prosodyIndicators.push("SOFT");
          break;
        case "medium":
          className += "opacity-100 text-base ";
          prosodyIndicators.push("MED");
          break;
        case "loud":
          className += "text-lg font-medium ";
          prosodyIndicators.push("LOUD");
          break;
        case "x-loud":
          className += "text-xl font-bold ";
          prosodyIndicators.push("X-LOUD");
          break;
      }
    }

    if (prosodyIndicators.length > 0) {
      indicators.prosody = prosodyIndicators;
    }
  }

  // Phoneme styles
  if (block.phoneme && block.phoneme.ph) {
    className +=
      "font-mono bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300 px-1 py-0.5 rounded border border-blue-200 dark:border-blue-800 border-dashed ";
    indicators.phoneme = `${block.phoneme.alphabet.toUpperCase()}: ${
      block.phoneme.ph
    }`;
  }

  // Break styles (margin for spacing)
  if (block.break && block.break.time > 0) {
    // Calculate margin based on break time (100ms = 1 unit, max 8 units for reasonable spacing)
    const marginClass = Math.min(Math.ceil(block.break.time / 100), 8);
    className += `mr-${marginClass} `;
    indicators.break = `${block.break.time}ms`;
  }

  return {
    className: className.trim(),
    indicators,
  };
}
