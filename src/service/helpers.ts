export const isObject = (obj?: any) => typeof obj === "object" && obj !== null;

export function extractFileExtension(filepath: string): string {
  const parts = filepath.split(".");
  if (parts.length > 1) {
    return parts.pop()!;
  }
  return "";
}

export function ensureArray(ar) {
  return Array.isArray(ar) ? ar : [ar].filter((f) => f !== undefined);
}

export function removeDuplicateNeighbors(arr: string[]) {
  const result = [];
  let prev = null;

  for (let i = 0; i < arr.length; i++) {
    const value = arr[i];
    if (value !== prev) {
      result.push(value);
      prev = value;
    }
  }

  return result;
}
