import { useMutation } from "@tanstack/react-query";
import { createInitialScript, editScript } from "@/utils/ai/google-ai";
import type { EditResponse, ScriptResponse } from "@/lib/types/script-response";
import { useEditorStore } from "../store";
import useUpdateScript from "./useUpdateScript";
import { Block } from "../types/block";
import { v4 as uuid } from "uuid";

interface UseEditScriptParams {
  prompt: string;
  id: string;
}

interface UseCreateInitialScriptParams {
  prompt: string;
}

export function useCreateInitialScript(
  handleResponse: (response: ScriptResponse) => void
) {
  return useMutation<ScriptResponse, Error, UseCreateInitialScriptParams>({
    mutationFn: async ({ prompt }) => {
      return await createInitialScript(prompt);
    },
    onError: (error) => {
      console.error("Error creating initial script:", error);
    },
    onSuccess: (data) => {
      handleResponse(data);
    },
  });
}

/**
 * Hook for editing script using Google Gemini
 */
export function useEditScript() {
  const { mutateAsync: updateScript } = useUpdateScript();
  
  const { blocks, actions, currentPage } = useEditorStore();
  // Calculate blocks for current page only
  const BLOCKS_PER_PAGE = 10;
  const startIndex = (currentPage - 1) * BLOCKS_PER_PAGE;
  const endIndex = startIndex + BLOCKS_PER_PAGE;
  const currentPageBlocks = blocks.slice(startIndex, endIndex);
  const handleGenerateBlocksViaScript = async (
    response: EditResponse,
    id: string
  ) => {
    try {
      // Create a new array of blocks to avoid mutating the original
      let newBlocks = [...blocks];

      // Process each operation in the edit response
      for (const operation of response) {
        switch (operation.operation) {
          case "create": {
            if (operation.createOperationValue) {
              const { content, idBefore } = operation.createOperationValue;
              const newBlockId = uuid();
              const newBlock: Block = {
                id: newBlockId,
                text: content,
                isAnimated: true,
              };

              // Find the position to insert the new block
              let insertIndex = newBlocks.length; // Default to end
              if (idBefore) {
                const beforeIndex = newBlocks.findIndex(
                  (block) => block.id === idBefore
                );
                if (beforeIndex !== -1) {
                  insertIndex = beforeIndex;
                }
              }

              // Insert the new block at the specified position
              newBlocks.splice(insertIndex, 0, newBlock);
            }
            break;
          }

          case "update": {
            if (operation.updateOperationValue) {
              const { blockId, content } = operation.updateOperationValue;
              newBlocks = newBlocks.map((block) =>
                block.id === blockId
                  ? { ...block, text: content, isAnimated: true }
                  : block
              );
            }
            break;
          }

          case "delete": {
            if (operation.deleteOperationValue) {
              const { blockId } = operation.deleteOperationValue;
              newBlocks = newBlocks.filter((block) => block.id !== blockId);
            }
            break;
          }
        }
      }
      actions.setBlocks(newBlocks);
      // Update the script in the database with the new blocks
      await updateScript({
        id,
        updates: {
          blocks: { data: newBlocks.map((b) => ({ ...b, isAnimated: false })) },
        },
      });
    } catch (error) {
      console.error("Error applying edit operations:", error);
      throw error;
    }
  };
  return useMutation<
    { scriptResponse: EditResponse; id: string },
    Error,
    UseEditScriptParams
  >({
    mutationFn: async ({ prompt, id }) => {
      const scriptResponse = await editScript(prompt, currentPageBlocks);
      return { scriptResponse, id };
    },
    onError: (error) => {
      console.error("Error editing script:", error);
    },
    onSuccess: async (data) => {
      await handleGenerateBlocksViaScript(data.scriptResponse, data.id);
    },
  });
}
