import { useMutation } from "@tanstack/react-query";
import { generateAudio } from "../apiclient/generate";
import { useAudioStore } from "../audiostore";
import { getBlockHash } from "../block-hash";
import { Block } from "../types";

export const useGenerateVoices = () => {
  const { getAudio, setAudio } = useAudioStore();

  return useMutation({
    mutationFn: async ({
      blocks,
      defaultVoiceId,
    }: {
      blocks: Block[];
      defaultVoiceId: string;
    }) => {
      const hash = getBlockHash(blocks);
      const cached = getAudio(hash);
      if (cached) return cached;
      const audioBuffer = await generateAudio(blocks, defaultVoiceId);
      setAudio(hash, audioBuffer);
      return audioBuffer;
    },
  });
};
