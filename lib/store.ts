import { create } from 'zustand';
import { v4 as uuid } from 'uuid';
import { Block } from '@/lib/types';

interface EditorState {
  blocks: Block[];
  selectedBlockId: string | null;
  speaking: boolean;
  actions: {
    createBlock: (afterId: string, initialText?: string, splitAt?: number) => string;
    updateBlock: (id: string, updates: Partial<Omit<Block, 'id'>>) => void;
    deleteBlock: (id: string) => void;
    mergeWithPrevious: (id: string) => void;
    setSelectedBlock: (id: string | null) => void;
    setSpeaking: (speaking: boolean) => void;
    reorderBlocks: (activeId: string, overId: string) => void;
  };
}

export const useEditorStore = create<EditorState>((set, get) => ({
  blocks: [{
    id: uuid(),
    text: '',
    ssml: '<speak></speak>'
  }],
  selectedBlockId: null,
  speaking: false,

  actions: {
    createBlock: (afterId: string, initialText = '', splitAt?: number) => {
      const newBlock = { 
        id: uuid(), 
        text: initialText,
        ssml: `<speak>${initialText}</speak>`
      };
      
      set(state => {
        const index = state.blocks.findIndex(b => b.id === afterId);
        const currentBlock = state.blocks[index];

        if (typeof splitAt === 'number') {
          // Split the current block's text
          const beforeCursor = currentBlock.text.slice(0, splitAt);
          const afterCursor = currentBlock.text.slice(splitAt);
          
          return {
            blocks: [
              ...state.blocks.slice(0, index),
              { ...currentBlock, text: beforeCursor },
              { ...newBlock, text: afterCursor },
              ...state.blocks.slice(index + 1)
            ],
            selectedBlockId: newBlock.id
          };
        }

        return {
          blocks: [
            ...state.blocks.slice(0, index + 1),
            newBlock,
            ...state.blocks.slice(index + 1)
          ],
          selectedBlockId: newBlock.id
        };
      });

      return newBlock.id;
    },

    updateBlock: (id: string, updates: Partial<Omit<Block, 'id'>>) => {
      set(state => ({
        blocks: state.blocks.map(block =>
          block.id === id ? { ...block, ...updates } : block
        )
      }));
    },

    deleteBlock: (id: string) => {
      set(state => {
        if (state.blocks.length === 1) return state;
        return {
          blocks: state.blocks.filter(b => b.id !== id)
        };
      });
    },

    mergeWithPrevious: (id: string) => {
      set(state => {
        const index = state.blocks.findIndex(b => b.id === id);
        if (index === 0) return state;

        const previousBlock = state.blocks[index - 1];
        const currentBlock = state.blocks[index];
        
        return {
          blocks: [
            ...state.blocks.slice(0, index - 1),
            {
              ...previousBlock,
              text: previousBlock.text + currentBlock.text
            },
            ...state.blocks.slice(index + 1)
          ],
          selectedBlockId: previousBlock.id
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
      set(state => {
        const oldIndex = state.blocks.findIndex(block => block.id === activeId);
        const newIndex = state.blocks.findIndex(block => block.id === overId);
        
        const blocks = [...state.blocks];
        const [movedBlock] = blocks.splice(oldIndex, 1);
        blocks.splice(newIndex, 0, movedBlock);
        
        return { blocks };
      });
    }
  }
}));
