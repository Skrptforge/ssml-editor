import { useEffect } from "react";
import { useScript } from "./useScript";
import { useCreateInitialScript } from "./useAiScript";
import { useUpdateScript } from "./useUpdateScript";
import { useEditorStore } from "@/lib/store";
import { Block } from "@/lib/types/block";
import type { CreateInitialScriptResponse } from "@/lib/types/script-response";
import { v4 as uuid } from "uuid";

interface UseScriptWithBlocksOptions {
  scriptId?: string;
  prompt?: string;
  autoGenerate?: boolean;
}

export const useScriptWithBlocks = ({
  scriptId,
}: UseScriptWithBlocksOptions = {}) => {
  const {
    data: script,
    isLoading: isLoadingScript,
    error: scriptError,
  } = useScript(scriptId);

  const { mutate: updateScript } = useUpdateScript();
  const { actions } = useEditorStore();
  const handleGenerateBlocksViaScript = async (
    response: CreateInitialScriptResponse
  ) => {
    const generatedBlocks: Block[] = Object.values(response)
      .filter((b) => b && Array.isArray(b.texts))
      .flatMap((b) => b.texts.map((text) => ({ id: uuid(), text })));

    const blocksToSet =
      generatedBlocks.length > 0 ? generatedBlocks : [{ id: uuid(), text: "" }];

    // Update script in database
    if (script?.id) {
      updateScript({
        id: script.id,
        updates: { blocks: { data: blocksToSet } },
      });
    }

    // Update store
    actions.setBlocks(blocksToSet);
  };
  const {
    mutate: generateScript,
    isPending: isGenerating,
    isError: isErrorInCreatingScript,
  } = useCreateInitialScript(handleGenerateBlocksViaScript);
  useEffect(() => {
    if (isLoadingScript || scriptError || !script?.title) {
      return;
    }
    if (script?.blocks) {
      actions.setBlocks(script.blocks.data);
    } else {
      generateScript({ prompt: script?.title });
    }
  }, [script, isLoadingScript, scriptError, actions]);

  return {
    isGenerating,
    isLoadingScript,
    scriptError,
    isErrorInCreatingScript,
  };
};

export default useScriptWithBlocks;
