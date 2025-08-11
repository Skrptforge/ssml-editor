import api from "../api";

export interface ApiKeyResponse {
  exists: boolean;
}

interface ErrorWithResponse {
  response?: {
    status: number;
  };
}

/**
 * Checks if the ElevenLabs API key exists
 * @returns Promise that resolves to true if API key exists, false otherwise
 */
export async function checkApiKeyExists(): Promise<boolean> {
  try {
    const response = await api.get<ApiKeyResponse>("/voice/key");
    return response.data.exists;
  } catch (error: unknown) {
    // Type guard for error with response
    if (
      typeof error === "object" &&
      error !== null &&
      "response" in error &&
      (error as ErrorWithResponse).response?.status === 401
    ) {
      return false;
    }
    // For other errors, rethrow
    throw error;
  }
}
