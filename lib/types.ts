export interface Block {
  id: string;
  text: string;
  ssml?: string;
}

export interface Selection {
  blockId: string;
  offset: number;
}
