export type ProsodyRate = "x-slow" | "slow" | "medium" | "fast" | "x-fast";
export type ProsodyPitch = "x-low" | "low" | "medium" | "high" | "x-high";
export type ProsodyVolume =
  | "silent"
  | "x-soft"
  | "soft"
  | "medium"
  | "loud"
  | "x-loud";
export type PhonemeAlphabet = "ipa" | "x-sampa";

export interface Block {
  id: string;
  text: string;
  isAnimated?: boolean;
  break?: {
    time: number;
  };
  emphasis?: {
    level: "strong" | "moderate" | "reduced";
  };
  prosody?: {
    rate?: ProsodyRate;
    pitch?: ProsodyPitch;
    volume?: ProsodyVolume;
  };
  phoneme?: {
    alphabet: PhonemeAlphabet;
    ph: string;
  };
  voice?: { voiceId: string; voiceName: string };
}

export interface BlockStyles {
  className: string;
  indicators: {
    phoneme?: string;
    emphasis?: string;
    prosody?: string[];
    break?: string;
  };
}
