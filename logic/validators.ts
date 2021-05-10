import { Model, Schema, string, Type, unknown } from "../deps.ts";

// 
// Get schema and validation
//
const getSchema = Schema({
  id: unknown.number().integer().gt(0),
});
/**
 * Default get validator
 */
export const getValidator = getSchema.destruct();

//
// List schema and validation
//
const listSchema = Schema({
  page: unknown.number().integer().gt(0).optional().transform(toDefault(1)),
  pageSize: unknown.number().integer().gt(0).optional().transform(
    toDefault(50),
  ),
  order: Schema.either("asc" as const, "desc" as const).optional().transform(
    toDefault("asc" as const),
  ),
  sortBy: string.max(200).trim().optional(),
});
/**
 * Default List validator
 */
export const listValidator = listSchema.destruct();
export type ListParams = Type<typeof listSchema>;

//
// Update validator
//
export function getUpdateValidator(model: typeof Model) {
  // Merge needs raw schema
  const schema = Schema.merge({id: unknown.number().integer().gt(0)}, (<any>model).schema);
  return schema.destruct();
}


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
