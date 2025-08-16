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
import { Languages, CheckSquare, Square } from "lucide-react";
import { VoicesDialog } from "../audio/VoiceDialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import SelectedPlayButton from "../audio/SelectedPlayButton";

const Toolbar = () => {
  const {
    setLanguage,
    selectAllBlocks,
    clearAllSelectedBlocks,
    setDefaultVoice,
  } = useEditorStore((state) => state.actions);
  const { selectedBlocksId, blocks, language, defaultVoice } = useEditorStore(
    (state) => state
  );

  const handleSelectVoice = (voiceId: string, voiceName: string) => {
    setDefaultVoice(voiceId, voiceName);
  };

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
    <div className="flex items-center justify-between py-2 mb-5 border-b border-border">
                   
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" onClick={handleSelectAll}>
                    {isAllSelected ? (
                      <CheckSquare className="h-4 w-4" />
                    ) : (
                      <Square className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                {isAllSelected ? "Deselect All" : "Select All"}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <div className="flex items-center gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger className="p- ">
                    <Languages className="h-4 w-10 text-muted-foreground" />
                  </SelectTrigger>
                  <SelectContent>
                    {languages.map((lang) => (
                      <SelectItem key={lang.value} value={lang.value}>
                        {lang.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </TooltipTrigger>
              <TooltipContent>Select Language</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-2">
                  <VoicesDialog
                    onSelectVoice={handleSelectVoice}
                    currentVoiceId={defaultVoice?.id}
                  />
                  {defaultVoice?.name && (
                    <span className="text-sm text-muted-foreground truncate max-w-[120px]">
                      {defaultVoice.name}
                    </span>
                  )}
                </div>
              </TooltipTrigger>
              <TooltipContent>Default Voice</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </div>
  );
};

export default Toolbar;
