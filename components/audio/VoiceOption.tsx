"use client";

import { useState } from "react";
import { Block } from "@/lib/types";
import { Users, Check } from "lucide-react";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { VoiceList } from "./VoiceList";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";

interface VoiceOptionProps {
  block: Block;
  onChange: (updates: Partial<Omit<Block, "id">>) => void;
}

export function VoiceOption({ block, onChange }: VoiceOptionProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleVoiceSelect = (voiceId: string, voiceName: string) => {
    onChange({
      voice: { voiceId, voiceName },
    });
    setIsDialogOpen(false);
  };

  const handleClearVoice = () => {
    onChange({
      voice: undefined,
    });
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <DropdownMenuItem
          className="flex items-center gap-2 cursor-pointer"
          onSelect={(e) => {
            e.preventDefault();
            setIsDialogOpen(true);
          }}
        >
          <Users className="h-4 w-4" />
          <span>Voice</span>
          {block.voice && (
            <div className="ml-auto flex items-center gap-1">
              <Check className="h-4 w-4 text-primary" />
              <span className="text-xs text-muted-foreground truncate max-w-20">
                {block.voice.voiceName}
              </span>
            </div>
          )}
        </DropdownMenuItem>
      </DialogTrigger>
      
      <VoiceList
        onSelectVoice={handleVoiceSelect}
        currentVoiceId={block.voice?.voiceId}
      />
    </Dialog>
  );
}