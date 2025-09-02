import { create } from "zustand";
import { v4 as uuid } from "uuid";
import { Block } from "@/lib/types/block";
import { FactCheckCorrection } from "@/utils/parsing";

interface EditorState {
  blocks: Block[];
  language: string;
  defaultVoice: { id: string; name: string } | null;
  selectedBlockId: string | null;
  speaking: boolean;
  selectedBlocksId: string[];
  currentPage: number;
  corrections: FactCheckCorrection[];
  actions: {
    createBlock: (
      afterId: string,
      initialText?: string,
      splitAt?: number
    ) => string;
    updateBlock: (id: string, updates: Partial<Omit<Block, "id">>) => void;
    deleteBlock: (id: string) => void;
    mergeWithPrevious: (id: string) => void;
    setSelectedBlock: (id: string | null) => void;
    setSpeaking: (speaking: boolean) => void;
    reorderBlocks: (activeId: string, overId: string) => void;
    setSelectedBlocksId: (id: string) => void;
    selectAllBlocks: () => void;
    clearAllSelectedBlocks: () => void;
    setLanguage: (lang: string) => void;
    setDefaultVoice: (voiceId: string, name: string) => void;
    setBlocks: (blocks: Block[]) => void;
    setCurrentPage: (page: number) => void;
    setCorrections: (corrections: FactCheckCorrection[]) => void;
  };
}

export const useEditorStore = create<EditorState>((set) => ({
  blocks: [
    {
      id: uuid(),
      text: "",
    },
  ],
  selectedBlockId: null,
  speaking: false,
  selectedBlocksId: [],
  defaultVoice: null,
  language: "en-US",
  currentPage: 1,
  corrections: [],
  setDefaultVoiceId: (voiceId: string, name: string) => {
    set({ defaultVoice: { id: voiceId, name } });
  },

  actions: {
    createBlock: (afterId: string, initialText = "", splitAt?: number) => {
      const newBlock = {
        id: uuid(),
        text: initialText,
      };

      set((state) => {
        const index = state.blocks.findIndex((b) => b.id === afterId);
        const currentBlock = state.blocks[index];

        if (typeof splitAt === "number") {
          // Split the current block's text
          const beforeCursor = currentBlock.text.slice(0, splitAt);
          const afterCursor = currentBlock.text.slice(splitAt);

          return {
            blocks: [
              ...state.blocks.slice(0, index),
              { ...currentBlock, text: beforeCursor },
              { ...newBlock, text: afterCursor },
              ...state.blocks.slice(index + 1),
            ],
            selectedBlockId: newBlock.id,
          };
        }

        return {
          blocks: [
            ...state.blocks.slice(0, index + 1),
            newBlock,
            ...state.blocks.slice(index + 1),
          ],
          selectedBlockId: newBlock.id,
        };
      });

      return newBlock.id;
    },

    updateBlock: (id: string, updates: Partial<Omit<Block, "id">>) => {
      set((state) => ({
        blocks: state.blocks.map((block) =>
          block.id === id ? { ...block, ...updates } : block
        ),
      }));
    },

    deleteBlock: (id: string) => {
      set((state) => {
        if (state.blocks.length === 1) return state;
        return {
          blocks: state.blocks.filter((b) => b.id !== id),
        };
      });
    },

    mergeWithPrevious: (id: string) => {
      set((state) => {
        const index = state.blocks.findIndex((b) => b.id === id);
        if (index === 0) return state;

        const previousBlock = state.blocks[index - 1];
        const currentBlock = state.blocks[index];

        return {
          blocks: [
            ...state.blocks.slice(0, index - 1),
            {
              ...previousBlock,
              text: previousBlock.text + currentBlock.text,
            },
            ...state.blocks.slice(index + 1),
          ],
          selectedBlockId: previousBlock.id,
        };
      });
    },

    setSelectedBlock: (id: string | null) => {
      set({ selectedBlockId: id });
    },

    setSpeaking: (speaking: boolean) => {
      set({ speaking });
    },

    reorderBlocks: (activeId: string, overId: string) => {
      set((state) => {
        const oldIndex = state.blocks.findIndex(
          (block) => block.id === activeId
        );
        const newIndex = state.blocks.findIndex((block) => block.id === overId);

        const blocks = [...state.blocks];
        const [movedBlock] = blocks.splice(oldIndex, 1);
        blocks.splice(newIndex, 0, movedBlock);

        return { blocks };
      });
    },
    setSelectedBlocksId: (id: string) => {
      set((state) => ({
        selectedBlocksId: [...state.selectedBlocksId, id],
      }));
    },
    selectAllBlocks: () => {
      set((state) => ({
        selectedBlocksId: state.blocks.map((block) => block.id),
      }));
    },
    clearAllSelectedBlocks: () => {
      set({ selectedBlocksId: [] });
    },
    setLanguage: (lang: string) => {
      set({ language: lang });
    },
    setDefaultVoice: (voiceId: string, name: string) => {
      set({ defaultVoice: { id: voiceId, name } });
    },

    setBlocks: (blocks: Block[]) => {
      set(() => ({
        blocks,
        selectedBlockId: blocks.length > 0 ? blocks[0].id : null,
      }));
    },

    setCurrentPage: (page: number) => {
      set({ currentPage: page });
    },

    setCorrections: (corrections: FactCheckCorrection[]) => {
      set({ corrections });
    },
  },
}));
