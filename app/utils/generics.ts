import { Dictionary } from "../../deps.ts";

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

/**
 * Converts a string to a Date.
 * Returns undefined if the string cannot be converted to a valid date.
 * @param str 
 * @returns 
 */
 export function strToDate(str: string) {
  const timestamp = Date.parse(str);
  if (isNaN(timestamp) == false) {
    return new Date(timestamp);
  }
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

// OBJECT
///////////////////////////////

/**
 * Transform a JSON object into x-www-form-urlencoded format.
 * @param json 
 * @returns 
 */
export function jsonToEncodedForm(json: {[key:string]: string | number | boolean}) {
  const formBody = [];
  for (const property in json) {
    const encodedKey = encodeURIComponent(property);
    const encodedValue = encodeURIComponent(json[property]);
    formBody.push(encodedKey + "=" + encodedValue);
  }
  return formBody.join("&");
}