// deno-lint-ignore-file no-explicit-any
import { lodash as _ } from '../../../deps.ts';

export enum ErrorCode {
  movedPermanently = 301,
  notValid = 400,
  notAuthorized = 401,
  forbidden = 403,
  notFound = 404,
  methodNotAllowed = 405,
  conflict = 409,
  unknown = 500
}

/**
 * Class that defines an error in the API.
 */
export class ApiError {
  readonly rawError: any;
  readonly statusCode: number;
  readonly message: string;
  readonly code: string;

  /**
   * 
   * @param error Raw error
   * @param code The code of the error being created. If not provided it will try to guess the error code.
   */
  constructor(error: any, code?: ErrorCode) {
    this.rawError = error;
    this.message = error.message || error;
    if (code) {
      this.statusCode = code;
      this.code = ErrorCode[code];
    } else {
      const val = this.identifyError(error);
      this.statusCode = val.statusCode;
      this.code = val.code;
    } 
  }
  
  /**
   * Identify a raw error as an API error.
   * @param error 
   * @returns 
   */
  private identifyError(error: any) {
    const code = error?.code || error;
    if (_.isString(code) && _.isNumber(ErrorCode[code])) {
      const statusCode = Number(ErrorCode[code]);
      return {
        statusCode,
        code: ErrorCode[statusCode]
      }
    } else {
      return {
        statusCode: 500,
        code: 'unknown'
      }
    }
  }
}
