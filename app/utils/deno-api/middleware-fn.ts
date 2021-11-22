import { NextFunction, Request, Response } from "./deps.ts";

/**
 * Extract the auth bearer token and sets it on res.locals.access_token
 * @param req 
 * @param res 
 * @param next 
 */
export function extractAccessToken(req: Request, res: Response, next: NextFunction) {
  res.locals.access_token = req.headers.get('Authorization')?.replace('Bearer ', '') ?? '';
  next();
}
