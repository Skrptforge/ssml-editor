import { headers } from "next/headers";

export async function getElevenLabsKey(): Promise<string> {
  const headersList = await headers();
  const apiKey = headersList.get("x-elevenlabs-key");
  
  if (!apiKey) {
    throw new Error("API key not found");
  }

  return apiKey;
}
