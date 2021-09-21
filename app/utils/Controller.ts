// deno-lint-ignore-file no-explicit-any
import { Request, Response } from "../deps.ts";
import { entriesToDictionaryReducer } from "../utils/generics.ts";

export type CreatedResponse = {
  affectedRows: number,
  lastInsertId: number
}

export type UpdatedResponse = {
  affectedRows: number,
}

export class Controller {
  static sendResponse(res: Response, payload: any) {
    /**
    * The default res-code is 200. We want to allow to change that. in That case,
    * payload will be an object consisting of a code and a payload. If not customized
    * send 200 and the payload as received in this method.
    */
    res.setStatus(payload.code || 200);
    const responsePayload = payload.payload !== undefined
      ? payload.payload
      : payload;
    if (responsePayload instanceof Object) {
      res.json(responsePayload);
    } else {
      res.end(responsePayload);
    }
  }

  static sendError(res: Response, error: any) {
    res.setStatus(error.statusCode || 500);
    if (error.error instanceof Object) {
      res.json(error.error);
    } else {
      res.end(error.error || error.message);
    }
  }

  static async handleRequest(
    req: Request,
    res: Response,
    serviceOperation: any,
    validator?: any,
  ) {
    try {
      let params = { ...(req.body || req.query), ...req.params };
      if (validator) {
        params = Controller.getValidatedParams(req, validator);
      }
      const serviceResponse = await serviceOperation(params);
      Controller.sendResponse(res, serviceResponse);
    } catch (error) {
      console.error(error);
      Controller.sendError(res, error);
    }
  }

  private static getValidatedParams(req: Request, validator: any) {
    const reqParams = Controller.collectRequestParams(req);
    const [error, params] = validator(reqParams);
    if (error) {
      error.statusCode = 400;
      throw error;
    }
    // Remove the params with undefined values
    return Object.entries(params).reduce(entriesToDictionaryReducer, {});
  }

  private static collectRequestParams(req: Request) {
    const headers = Array.from(req.headers.entries()).reduce(
      entriesToDictionaryReducer,
      {},
    );
    return {
      ...headers,
      ...req.params,
      ...req.body,
      ...req.query,
    };
  }
}
