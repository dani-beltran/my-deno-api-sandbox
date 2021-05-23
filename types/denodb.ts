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
