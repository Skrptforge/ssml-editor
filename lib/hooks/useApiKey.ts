"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../api";
import { checkApiKeyExists } from "../apiclient/key";
import { useRouter } from "next/navigation";

interface SetApiKeyRequest {
  apiKey: string;
}

export function useApiKey() {
  const queryClient = useQueryClient();
  const router = useRouter();
  // Query to check if API key exists
  const {
    data: exists = true,
    isLoading: isChecking,
    error: existsError,
  } = useQuery({
    queryKey: ["apiKey", "exists"],
    queryFn: checkApiKeyExists,
    staleTime: 1000 * 60 * 5, // Consider data stale after 5 minutes
  });

  // Mutation to set API key
  const {
    mutateAsync: setApiKey,
    isPending: isSettingKey,
    error: setError,
  } = useMutation({
    mutationFn: async ({ apiKey }: SetApiKeyRequest) => {
      await api.post("/setup/key", { apiKey });
    },
    onSuccess: () => {
      // Invalidate exists query after successful set
      queryClient.invalidateQueries({ queryKey: ["apiKey", "exists"] });
    },
  });

  // Mutation to remove API key
  const {
    mutateAsync: removeApiKey,
    isPending: isRemovingKey,
    error: removeError,
  } = useMutation({
    mutationFn: async () => {
      await api.delete("/setup/key");
    },
    onSuccess: () => {
      // Invalidate exists query after successful removal
      queryClient.invalidateQueries({ queryKey: ["apiKey", "exists"] });
      router.push("/");
    },
  });

  // Combine all loading states
  const isLoading = isChecking || isSettingKey || isRemovingKey;

  // Get the relevant error (if any)
  const error = existsError || setError || removeError;

  return {
    exists,
    setApiKey,
    removeApiKey,
    isLoading,
    isRemovingKey,
    error: error ? error.message : null,
  };
}
