// deno-lint-ignore-file no-explicit-any
import { Request, Response } from "../deps.ts";
import { entriesToDictionaryReducer } from "../utils/generics.ts";

/**
 * This class offer the basic functionality of any controller.
 */
export class Controller {

  /**
   * Method that handles a http request in the default way.
   */
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

  /**
   * function responsible for sending the successful http response
   */
  private static sendResponse(res: Response, payload: any) {
    // The default res-code is 200. We want to allow to change that. in That case,
    // payload will be an object consisting of a code and a payload. If not customized
    // send 200 and the payload as received in this method.
    //
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

  /**
   * function responsible for sending the failed http response
   */
  private static sendError(res: Response, error: any) {
    res.setStatus(error.statusCode || 500);
    if (error.error instanceof Object) {
      res.json(error.error);
    } else {
      res.end(error.error || error.message);
    }
  }

  /**
   * Gets the params from the http requests that that fullfil the validation requirements.
   * It will throw an error if some of the params are not valid.
   */
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

  /**
   * @returns all possible params of a http request in an object. Including the
   * body, the query search params, the url params and the headers.
   */
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
