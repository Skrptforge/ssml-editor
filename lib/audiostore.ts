import { create } from "zustand";

interface AudioStore {
  cache: Map<string, ArrayBuffer>;
  getAudio: (hash: string) => ArrayBuffer | undefined;
  setAudio: (hash: string, audio: ArrayBuffer) => void;
}

export const useAudioStore = create<AudioStore>((set, get) => ({
  cache: new Map(),

  getAudio: (hash) => {
    return get().cache.get(hash);
  },

  setAudio: (hash, audio) => {
    const newCache = new Map(get().cache);
    newCache.set(hash, audio);
    set({ cache: newCache });
  },
}));
