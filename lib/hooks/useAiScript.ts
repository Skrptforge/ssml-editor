import { useMutation } from "@tanstack/react-query";
import { createInitialScript, editScript } from "@/utils/ai/google-ai";
import type {
  CreateInitialScriptResponse,
  EditScriptResponse,
} from "@/lib/types/script-response";

interface UseEditScriptParams {
  prompt: string;
}

interface UseCreateInitialScriptParams {
  prompt: string;
}

export function useCreateInitialScript(
  handleResponse: (response: CreateInitialScriptResponse) => void
) {
  return useMutation<
    CreateInitialScriptResponse,
    Error,
    UseCreateInitialScriptParams
  >({
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
  return useMutation<EditScriptResponse, Error, UseEditScriptParams>({
    mutationFn: async ({ prompt }) => {
      return await editScript(prompt);
    },
    onError: (error) => {
      console.error("Error editing script:", error);
    },
  });
}
