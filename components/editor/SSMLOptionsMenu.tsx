"use client";

import { useState } from "react";
import { Block } from "@/lib/types";
import { Timer, Bold, MoreVertical, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu";

interface SSMLOptionsMenuProps {
  block: Block;
  onChange: (updates: Partial<Omit<Block, "id">>) => void;
}

export function SSMLOptionsMenu({ block, onChange }: SSMLOptionsMenuProps) {
  const [breakTime, setBreakTime] = useState(block.break?.time || 0);

  const handleBreakChange = (time: number) => {
    onChange({
      break: time > 0 ? { time } : undefined,
    });
  };

  const handleEmphasisChange = (level: "strong" | "moderate" | "reduced") => {
    // Toggle the emphasis - if it's already selected, remove it, otherwise set it
    const currentLevel = block.emphasis?.level;
    onChange({
      emphasis: currentLevel === level ? undefined : { level },
    });
  };

  const handleBreakInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    setBreakTime(value);
    handleBreakChange(value);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="h-8 w-8 p-0 hover:bg-gray-300 cursor-pointer"
        >
          <MoreVertical className="h-4 w-4 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>SSML Options</DropdownMenuLabel>
        <DropdownMenuSeparator />

        <div className="px-2 py-1.5 flex items-center justify-between ">
          <div className="flex items-center gap-2">
            <Timer className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">Break (ms):</span>
          </div>

          <Input
            type="number"
            value={breakTime}
            onChange={handleBreakInputChange}
            min={0}
            step={100}
            className="h-6 w-20 text-xs"
            onClick={(e) => e.stopPropagation()}
          />
        </div>

        <DropdownMenuSeparator />

        <DropdownMenuSub>
          <DropdownMenuSubTrigger className="flex items-center gap-2">
            <Bold className="h-4 w-4" />
            <span>Emphasis</span>
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            {["strong", "moderate", "reduced"].map((level) => (
              <DropdownMenuItem
                key={level}
                className="flex items-center gap-2 cursor-pointer"
                onSelect={() =>
                  handleEmphasisChange(
                    level as "strong" | "moderate" | "reduced"
                  )
                }
              >
                <Check
                  className={`h-4 w-4 ${
                    block.emphasis?.level === level
                      ? "text-primary"
                      : "text-transparent"
                  }`}
                />
                <span className="capitalize">{level}</span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuSubContent>
        </DropdownMenuSub>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
