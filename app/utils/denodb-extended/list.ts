import { Schema, string, unknown } from "./deps.ts";
import { toDefault } from "./utils.ts";

/**
 * List computed-types schema for validation
 */
 export const listSchema = {
  page: unknown.number().integer().gt(0).optional().transform(
    toDefault(1),
  ),
  pageSize: unknown.number().integer().gt(0).optional().transform(
    toDefault(50),
  ),
  order: Schema.either("asc" as const, "desc" as const).optional().transform(
    toDefault("asc" as const),
  ),
  sortBy: string.max(200).trim().optional(),
};
