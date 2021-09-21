// deno-lint-ignore-file no-explicit-any
import { Model } from "../deps.ts";

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
 * TODO Test if this happens using other DB connector. 
 * TODO Add this type to lib denoDB
 */
export type CreatedResponse = { affectedRows: number, lastInsertId: number };