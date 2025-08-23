"use client";
import React from "react";
import { Trash } from "lucide-react";
import { useDeleteScript } from "@/lib/hooks";
import { cn } from "@/lib/utils";
import { useRouter, usePathname } from "next/navigation";

export interface Script {
  id: number;
  name: string;
  date: string;
  category: string;
}

interface ScriptCardProps {
  script: Script;
  onClick?: (script: Script) => void;
}

const ScriptCard: React.FC<ScriptCardProps> = ({ script, onClick }) => {
  const router = useRouter();
  const pathname = usePathname();
  const isActive =
    typeof pathname === "string" && pathname.startsWith(`/create/${script.id}`);
  const navigateToCreate = () => {
    onClick?.(script);
    router.push(`/create/${script.id}`);
  };

  const deleteMutation = useDeleteScript();

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    try {
      await deleteMutation.mutateAsync(script.id);
    } catch (err) {
      console.error("Failed to delete script", err);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      navigateToCreate();
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      aria-current={isActive ? "true" : undefined}
      onClick={navigateToCreate}
      onKeyDown={handleKeyDown}
      title={script.name}
      className={cn(
        // Display & positioning
        "cursor-pointer",
        // Box
        "rounded-md overflow-hidden",
        // Spacing
        "",
        // Visual
        "bg-background/0",
        // Interaction
        "hover:bg-neutral-100 dark:hover:bg-zinc-800 transition-colors",
        // Active state when on /create/:id
        isActive && "bg-neutral-100 dark:bg-zinc-800"
      )}
    >
      <div className={cn("p-2 flex items-center justify-between gap-2")}>
        {/* Fixed: Added flex-1 and min-w-0 to allow truncation */}
        <h3
          className={cn(
            // Layout - KEY CHANGES HERE
            "flex-1 w-32",
            // Typography
            "font-normal text-sm leading-tight",
            // Truncation - Explicit ellipsis
            "overflow-hidden whitespace-nowrap text-ellipsis",
            // Color
            "text-foreground"
          )}
        >
          {script.name}
        </h3>

        {/* Fixed: Added flex-shrink-0 to prevent button from shrinking */}
        <button
          onClick={handleDelete}
          aria-label="Delete script"
          className={cn(
            // Layout - KEY CHANGE HERE
            "flex-shrink-0 cursor-pointer",
            // Box
            "p-1 rounded",
            // Interaction
            "hover:bg-destructive/10 focus:outline-none focus:ring-2 focus:ring-destructive",
            // State
            deleteMutation.isPending && "opacity-50 cursor-not-allowed"
          )}
          disabled={deleteMutation.isPending}
        >
          <Trash className={cn("h-4 w-4", "text-destructive ")} />
        </button>
      </div>
    </div>
  );
};

export default ScriptCard;
