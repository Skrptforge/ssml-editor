import api from "../api";
import { VoiceData } from "../types/voice";

export const getVoices = async (nextPageToken?: string): Promise<VoiceData> => {
  try {
    const response = await api.get<VoiceData>("/voice/audioservice/voices", {
      params: {
        nextPageToken,
      },
    });

    return response.data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`Failed to fetch voices: ${error.message}`);
    }
    throw new Error("An unexpected error occurred while fetching voices.");
  }
};
