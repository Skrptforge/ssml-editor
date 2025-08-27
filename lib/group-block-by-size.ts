import type { Block } from "./types/block";

export const groupBlocksByVoice = (blocks: Block[]): Block[][] => {
  if (blocks.length === 0) return [];

  const result: Block[][] = [];
  let currentGroup: Block[] = [];
  let lastVoiceId = blocks[0].voice?.voiceId ?? null;

  for (const block of blocks) {
    const currentVoiceId = block.voice?.voiceId ?? null;

    if (currentVoiceId === lastVoiceId) {
      currentGroup.push(block);
    } else {
      result.push(currentGroup);
      currentGroup = [block];
      lastVoiceId = currentVoiceId;
    }
  }

  if (currentGroup.length > 0) {
    result.push(currentGroup);
  }

  return result;
};
