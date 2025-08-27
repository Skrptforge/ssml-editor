import crypto from "crypto";
import type { Block } from "./types/block"; // adjust path if needed

// Deep copy but excluding `id`
const sanitizeBlocks = (blocks: Block[]) => {
  return blocks.map(({ id, ...rest }) => rest);
};

export const getBlockHash = (blocks: Block[]): string => {
  const sanitized = sanitizeBlocks(blocks);

  // Deterministic stringify with sorted keys
  const normalized = JSON.stringify(sanitized, (key, value) => {
    if (value && typeof value === "object" && !Array.isArray(value)) {
      return Object.keys(value)
        .sort()
        .reduce((acc, k) => {
          acc[k] = value[k];
          return acc;
        }, {} as Record<string, unknown>);
    }
    return value;
  });

  return crypto
    .createHash("sha256")
    .update(normalized)
    .digest("hex")
    .slice(0, 16); // shorter cache key
};