import { Schema, string, unknown } from "./deps.ts";
import { toDefault } from "./utils.ts";

/**
 * List computed-types schema for validation
 */
 export const listSchema = {
  page: unknown.number().integer().gt(0).optional().transform(
    toDefault(1),
  ),
  "page_size": unknown.number().integer().gt(0).optional().transform(
    toDefault(50),
  ),
  order: Schema.either("asc" as const, "desc" as const).optional().transform(
    toDefault("asc" as const),
  ),
  "sort_by": string.max(200).trim().optional(),
};
