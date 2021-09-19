import { Dictionary } from "../deps.ts";

// STRING
///////////////////////////////

/**
 * Converts the first character of string to upper case.
 * @param string 
 * @returns 
 */
export function upperFirst(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

/**
 * Converts the first character of string to lower case.
 * @param string 
 * @returns 
 */
 export function lowerFirst(string: string) {
  return string.charAt(0).toLowerCase() + string.slice(1);
}

// COLLECTION
///////////////////////////////

/**
   * Reducer function to be used with reduce()
   * It transform and array of entries into an pair key/value object.
   * It will also remove any key/value which value is undefined.
   * @param acc 
   * @param current 
   * @returns 
   */
export function entriesToDictionaryReducer<T>(
  acc: Dictionary<T>,
  current: [string, T],
) {
  if (current[1] !== undefined) {
    acc[current[0]] = current[1];
  }
  return acc;
}
