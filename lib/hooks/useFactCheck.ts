import { useMutation } from "@tanstack/react-query";
import { factCheckBlocksBatch } from "@/utils/ai/google-ai";
import { Block } from "@/lib/types/block";
import { useEditorStore } from "@/lib/store";

export const useFactCheck = () => {
  const { blocks, actions, currentPage } = useEditorStore();
  // Calculate blocks for current page only
  const BLOCKS_PER_PAGE = 10;
  const startIndex = (currentPage - 1) * BLOCKS_PER_PAGE;
  const endIndex = startIndex + BLOCKS_PER_PAGE;
  const currentPageBlocks = blocks.slice(startIndex, endIndex);
  return useMutation({
    mutationFn: async () => {
      return await factCheckBlocksBatch(currentPageBlocks);
    },
    onError: (error) => {
      console.error("Error fact-checking blocks:", error);
      // Clear any previous corrections on error
      actions.setCorrections([]);
    },
    onSuccess: (data) => {
      console.log("Fact check completed:", data);
      actions.setCorrections(data.corrections);
    },
  });
};

export default useFactCheck;
