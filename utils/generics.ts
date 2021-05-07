import { Dictionary } from "../deps.ts";

/**
   * Reducer function to be used with reduce()
   * It transform and array of entries into an pair key/value object.
   * It will also remove any key/value which value is undefined.
   * @param acc 
   * @param current 
   * @returns 
   */
export function entriesToDictionaryReducer(
  acc: Dictionary<any>,
  current: [string, any],
) {
  if (current[1] !== undefined) {
    acc[current[0]] = current[1];
  }
  return acc;
}
