import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { headers } from "next/headers"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export async function getElevenLabsKey(): Promise<string> {
  const headersList = await headers();
  const apiKey = headersList.get("x-elevenlabs-key");
  
  if (!apiKey) {
    throw new Error("API key not found");
  }

  return apiKey;
}
