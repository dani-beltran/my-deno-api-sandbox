// deno-lint-ignore-file no-explicit-any
import { NextFunction } from "./deps.ts";
import { Model, Type } from "./deps.ts";
import { listSchema } from "./schema-definitions.ts";
import { Request, Response } from "./deps.ts";
import { Router } from "./deps.ts";


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

export type ListParams = Type<typeof listSchema>;

export type Middleware = (req: Request, res: Response, next: NextFunction) => void | Promise<void>;

export type RouteSchema = {
  method: 'get' | 'post' | 'put' | 'patch' | 'delete',
  path: string,
  beforeAuth?: Middleware[],
  auth?: Middleware[],
  beforeValidation?: Middleware[],
  validation?: Middleware[],
  controller: (req: Request, res: Response) => Promise<void>
};

export interface IApiRouter {
  getPath: (basePath: string) => string,
  getRouter: () => InstanceType<typeof Router>
}