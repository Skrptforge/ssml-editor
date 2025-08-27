// this contains the initial texts for each block mapped with their segments
export interface CreateInitialScriptResponse {
  [key: string]: {
    texts: string[];
    name : string
  };
}

// this contains id of the block to be edited and the new text
export interface EditScriptResponse {
  [key: string]: string;
}
