// deno-lint-ignore-file no-explicit-any
import { Request, Response } from "./deps.ts";
import { entriesToDictionaryReducer } from "../../utils/generics.ts";
import { ApiError } from "./api-error.ts";

/**
 * This class offer the basic functionality of any controller.
 */
export class Controller {

  /**
   * Method that hands off the http request to the service and sends the http
   * response with the data returned by the service.
   * If the service throws an exception it will be managed and the response
   * will contain the corresponding http status code.
   * If a validator is passed, it will validate the request params, which
   * are URL params and body or query params.
   * @param req http request (opine lib)
   * @param res http response (opine lib)
   * @param serviceOperation 
   * @param validator params validator
   * @param extraParams optional parameters to pass to the service. Useful for passing headers as params. It's recommended to validate then before doing so.
   */
  static async passRequestToService(
    req: Request,
    res: Response,
    serviceOperation: (params: any) => any,
    validator?: ((params: any) => any) | null,
    extraParams?: {[key: string]: number | string | boolean}
  ) {
    try {
      let params = req.method === 'get' 
        ? {...req.params, ...req.query } 
        : {...req.params, ...req.body };
      if (validator) {
        params = Controller.getValidatedParams(req, validator);
      }
      if (extraParams) {
        params = {...params, ...extraParams};
      }
      const serviceResponse = await serviceOperation(params);
      Controller.sendResponse(res, serviceResponse);
    } catch (error) {
      const apiError = new ApiError(error);
      if (apiError.statusCode === 500) {
        console.error(apiError);
      }
      Controller.sendError(res, apiError);
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
    res.setStatus(payload?.statusCode || 200);
    const responsePayload = payload?.payload ?? payload;
    if (responsePayload instanceof Object) {
      res.json(responsePayload);
    } else {
      res.end(responsePayload);
    }
  }

  /**
   * function responsible for sending the failed http response
   */
  private static sendError(res: Response, error: ApiError) {
    res.setStatus(error.statusCode);
    res.json({
      error: error.code,
      error_message: error.message
    });
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
   * body, the query search params and the url params.
   */
  private static collectRequestParams(req: Request) {
    return {
      ...req.params,
      ...req.body,
      ...req.query,
    };
  }

  /**
   * It run middleware functions. To use within a controller.
   * If there's an exception, it will be managed and the response sent with 
   * the corresponding http status code.
   * @param req 
   * @param res 
   * @param middlewareFns 
   * @returns an array with the results of each middleware function
   */
  static runMiddleware(req: Request, res: Response, middlewareFns: ((req: Request, res: Response) => any)[]) {
    try {
      return middlewareFns.map((fn) => {
        return fn(req, res);
      });
    } catch(error) {
      const apiError = new ApiError(error);
      Controller.sendError(res, apiError);
      throw error;
    }
  }

  /**
   * @param req 
   * @param validator
   * @returns the request headers that passed the validation
   */
  static getValidatedHeaders(req: Request, validator: (params: any) => any) {
    const reqHeaders = Array.from(req.headers.entries()).reduce(
      entriesToDictionaryReducer,
      {},
    );
    const [error, headers] = validator(reqHeaders);
    if (error) {
      error.statusCode = 400;
      throw error;
    }
    // Remove the headers with undefined values
    return Object.entries(headers).reduce(entriesToDictionaryReducer, {});
  }
}
