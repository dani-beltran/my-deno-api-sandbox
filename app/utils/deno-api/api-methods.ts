// deno-lint-ignore-file no-explicit-any
import { ApiError, ErrorCode } from "./api-error.ts";
import { Request, Response, Schema } from "./deps.ts";
import { entriesToDictionaryReducer } from "../../utils/generics.ts";
import { NextFunction, ValidationError } from "../../../deps.ts";

/**
 * Returns a controller that runs the provided service and send the according
 * HTTP response.
 * To use with Opine framework.
 * @param service 
 * @param successStatusCode 
 */
export function getController(
  service: (params: any) => any,
  successStatusCode = 200
) {
  return async (req: Request, res: Response) => {
    try {
      const params = { ...req.params, ...req.query, ...req.body };
      const payload = await service(params);
      sendResponse(res, payload, successStatusCode);
    } catch (error) {
      const apiError = new ApiError(error);
      if (apiError.statusCode === 500) {
        console.error(apiError);
      }
      sendError(res, apiError);
    }
  }
}

function sendResponse(res: Response, payload: any, statusCode = 200) {
  res.setStatus(statusCode);
  if (payload instanceof Object) {
    res.json(payload);
  } else {
    res.end(payload);
  }
}

function sendError(res: Response, error: ApiError) {
  res.setStatus(error.statusCode);
  res.json({
    error_code: error.code,
    error_message: error.message
  });
}

/**
 * Returns a validation middleware function to validate the path parameters.
 * To use with Opine framework.
 * @param schema 
 */
export function getParamsValidation(schema: any) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      req.params = runValidation(req.params, schema);
      next();
    } catch(e) {
      sendError(res, e);
    }
  }
}

/**
 * Returns a validation middleware function to validate the search query parameters.
 * To use with Opine framework.
 * @param schema 
 */
export function getQueryValidation(schema: any) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      req.query = runValidation(req.query, schema);
      next();
    } catch(e) {
      sendError(res, e);
    }
  }
}

/**
 * Returns a validation middleware function to validate the request body.
 * To use with Opine framework.
 * @param schema 
 */
export function getBodyValidation(schema: any) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = runValidation(req.body, schema);
      next();
    } catch(e) {
      sendError(res, e);
    }
  }
}

function runValidation(params: any, schema: any) {
  const validator = Schema(schema, { strict: true }).destruct();
  const [error, validatedParams] = validator(params) as [ValidationError | null, any?];
  if (error) {
    throw new ApiError(error, ErrorCode.notValid);
  }
  // Remove the params with undefined values
  return Object.entries(validatedParams).reduce(entriesToDictionaryReducer, {});
}