// deno-lint-ignore-file no-explicit-any
import { Schema } from "./deps.ts";


/**
 * Validator that does nothing.
 * @param params 
 * @returns an array containing error as false and the params.
 */
export function emptyValidator(params: any) {
  return [false, params];
}

/**
 * Builds a validation function from a "computed-types" schema.
 * Check computed-types library to know how to build a schema object.
 * @param schema 
 * @param strict By default, the validator will ignore all properties that aren't exist on the schema. If you want to throw an error instead you can toggle the strict mode on.
 * @returns validation function 
 */
export function buildValidatorFromSchema(schema: {[key: string]: any }, strict = false) {
  return Schema(schema, {strict}).destruct();
}