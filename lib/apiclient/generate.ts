import api from "../api";
import { blocksToSSML } from "../convert-to-ssml";
import { groupBlocksByVoice } from "../group-block-by-size";
import { Block } from "../types/block";

export const generateAudio = async (
  blocks: Block[],
  defaultVoiceId: string,
) => {
  const groupedBlocks = groupBlocksByVoice(blocks);
  const voiceTexts = groupedBlocks.map((group) => {
    const voiceId = group[0].voice?.voiceId ?? defaultVoiceId;
    const text = blocksToSSML(group);
    return { voice_id: voiceId, text };
  });

  const response = await api.post(
    "/voice/audioservice/generate",
    { voiceTexts },
    {
      headers: {
        "Content-Type": "application/json",
      },
      responseType: "arraybuffer",
    }
  );

  return response.data; 
};
