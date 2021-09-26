import { Schema, string } from "./deps.ts";

/**
 * Validates if the request is sending content of type JSON.
 * @returns 
 */
export function jsonAppValidator() {
  const headerSchema = {
    "content-type": string.equals('application/json')
  }
  return Schema(headerSchema, {strict: false}).destruct();
}
