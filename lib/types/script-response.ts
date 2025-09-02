// this contains the initial texts for each block mapped with their segments
export interface ScriptResponse {
  [key: string]: {
    texts: string[];
    name: string;
  };
}

export type EditResponse = Array<{
  operation: "create" | "update" | "delete";
  createOperationValue?: {
    content: string;
    idBefore?: string; // undefined when we want to add something at first position
  };
  updateOperationValue?: {
    blockId: string;
    content: string;
  };
  deleteOperationValue?: {
    blockId: string;
  };
}>;

export type VerifyResponse = Array<{
  problem: string;
  blockId: string;
  correction: string;
}>;
