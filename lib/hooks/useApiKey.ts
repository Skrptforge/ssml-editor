"use client";

import { useState } from "react";
import api from "../api";

export function useApiKey() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const setApiKey = async (apiKey: string) => {
    setIsLoading(true);
    setError(null);

    try {
      await api.post('/key', { apiKey });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to set API key";
      setError(message);
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const removeApiKey = async () => {
    setIsLoading(true);
    setError(null);

    try {
      await api.delete('/key');
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to remove API key";
      setError(message);
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    setApiKey,
    removeApiKey,
    isLoading,
    error,
  };
}
