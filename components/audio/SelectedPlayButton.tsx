"use client";

import React, { useState } from "react";
import { useAudioStore } from "@/lib/audiostore";
import { useEditorStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Play, Pause, Loader2 } from "lucide-react";
import { getBlockHash } from "@/lib/block-hash";
import { useGenerateVoices } from "@/lib/hooks/useGenerateVoices";

const SelectedPlayButton = () => {
  const { selectedBlocksId, blocks, defaultVoice } = useEditorStore(
    (state) => state
  );
  const { getAudio } = useAudioStore();
  const { mutate: generate, isPending: isLoading } = useGenerateVoices();
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioEl, setAudioEl] = useState<HTMLAudioElement | null>(null);
  console.log("SelectedPlayButton blocks:", blocks);
  // 🎯 Get selected blocks
  const selectedBlocks = blocks.filter((b) => selectedBlocksId.includes(b.id));
  if (selectedBlocks.length === 0) return null;

  const handlePlay = () => {
    const hash = getBlockHash(selectedBlocks);
    const cached = getAudio(hash);

    if (cached) {
      // play from cache
      const blob = new Blob([cached], { type: "audio/mpeg" });
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      setAudioEl(audio);
      audio.play();
      setIsPlaying(true);

      audio.onended = () => setIsPlaying(false);
    } else {
      // generate audio
      if(!defaultVoice?.id) return;
      generate(
        { blocks: selectedBlocks, defaultVoiceId: defaultVoice?.id  },
        {
          onSuccess: (buf) => {
            const blob = new Blob([buf], { type: "audio/mpeg" });
            const url = URL.createObjectURL(blob);
            const audio = new Audio(url);
            setAudioEl(audio);
            audio.play();
            setIsPlaying(true);

            audio.onended = () => setIsPlaying(false);
          },
        }
      );
    }
  };

  const handlePause = () => {
    if (audioEl) {
      audioEl.pause();
      setIsPlaying(false);
    }
  };
  console.log("SelectedPlayButton rendered", isLoading, isPlaying);
  if (isLoading) {
    return <Loader2 className="h-5 w-5 animate-spin" />;
  }
  return (
    <Button
      variant="default"
      size="icon"
      disabled={isLoading}
      onClick={isPlaying ? handlePause : handlePlay}
    >
      {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
    </Button>
  );
};

export default SelectedPlayButton;
