import { Schema, string, unknown } from "../deps.ts";

const getSchema = Schema({
  id: unknown.number().integer().gt(0),
});
/**
 * Default get validator
 */
export const getValidator = getSchema.destruct();

const listSchema = Schema({
  page: unknown.number().integer().gt(0).optional().transform(toDefault(1)),
  pageSize: unknown.number().integer().gt(0).optional().transform(
    toDefault(50),
  ),
  order: Schema.either("ASC" as const, "DESC" as const).optional().transform(
    toDefault("ASC" as const),
  ),
  sortBy: string.max(200).trim().optional(),
});
/**
 * Default List validator
 */
export const listValidator = listSchema.destruct();

/**
 * Returns a function that can be used by Schema.transform to set a default
 * value in the validation process.
 * @param defaultValue 
 * @returns 
 */
function toDefault<T, K>(defaultValue: K) {
  return (x: T) => {
    if (x == null) {
      return defaultValue;
    } else {
      return x;
    }
  };
}
