export interface Block {
  id: string;
  text: string;
  break?: {
    time: number;
  };
  emphasis?: {
    level: "strong" | "moderate" | "reduced";
  };
  prosody?: {
    rate?: string;  
    pitch?: string; 
    volume?: string; 
  };
}

export interface Selection {
  blockId: string;
  offset: number;
}
