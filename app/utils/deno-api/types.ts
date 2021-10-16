// deno-lint-ignore-file no-explicit-any
import { Model, Type } from "./deps.ts";
import { listSchema } from "./schema-definitions.ts";


/**
 * Extended Model class type.
 * Based on DenoDB models, but with extended properties from other libs like:
 * - "computed-types"
 */
 export type IModel = {
  schema: { [key: string]: any }
} & typeof Model;

/**
 * The actual response from Model.create() in denodb v1.0.39 using sqlite.
 */
export type CreatedResponse = { affectedRows: number, lastInsertId: number };

/**
 * The actual response from Model.update() and Model.delete() in denodb v1.0.39 using sqlite.
 */
export type UpdatedResponse = { affectedRows: number };

/**
 * 
 */
export type ListParams = Type<typeof listSchema>;