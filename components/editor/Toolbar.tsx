"use client";

import { useEditorStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Languages, CheckSquare, Square, RotateCcw } from "lucide-react";
import VoiceSelector from "./VoiceSelector";

const Toolbar = () => {
  const { setLanguage, selectAllBlocks, clearAllSelectedBlocks } =
    useEditorStore((state) => state.actions);
  const { selectedBlocksId, blocks, language } = useEditorStore(
    (state) => state
  );

  // Common languages for text-to-speech
  const languages = [
    { value: "en-US", label: "English (US)" },
    { value: "en-GB", label: "English (UK)" },
    { value: "es-ES", label: "Spanish" },
    { value: "fr-FR", label: "French" },
    { value: "de-DE", label: "German" },
    { value: "it-IT", label: "Italian" },
    { value: "pt-BR", label: "Portuguese" },
    { value: "ja-JP", label: "Japanese" },
    { value: "ko-KR", label: "Korean" },
    { value: "zh-CN", label: "Chinese" },
  ];

  const handleSelectAll = () => {
    if (selectedBlocksId.length === blocks.length) {
      clearAllSelectedBlocks();
    } else {
      selectAllBlocks();
    }
  };

  const isAllSelected = selectedBlocksId.length === blocks.length;

  return (
    <div className="flex items-center gap-4 p-2 mb-5 bg-card border-b border-border">
      {/* Block Selection Controls */}
      <div className="flex items-center justify-between w-full">
        <div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSelectAll}
            className="flex items-center gap-2"
          >
            {isAllSelected ? (
              <CheckSquare className="h-4 w-4" />
            ) : (
              <Square className="h-4 w-4" />
            )}
            {isAllSelected ? "Deselect All" : "Select All"}
          </Button>
        </div>
        <div className="flex items-center gap-2">
          {/* Language Selection */}
          <div className="flex items-center gap-2">
            <Languages className="h-4 w-4 text-muted-foreground" />
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                {languages.map((lang) => (
                  <SelectItem key={lang.value} value={lang.value}>
                    {lang.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Voice Selection */}
          <VoiceSelector />
        </div>
      </div>
    </div>
  );
};

export default Toolbar;
