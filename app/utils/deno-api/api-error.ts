// deno-lint-ignore-file no-explicit-any
export class ApiError {
  readonly rawError: any;
  readonly statusCode: number;
  readonly message: string;
  readonly errorCode: string;
  readonly errorDefinitions = [
    {
      statusCode: 400,
      code: 'notValid'
    },
    {
      statusCode: 401,
      code: 'notAuthorized'
    },
    {
      statusCode: 403,
      code: 'forbidden'
    },
    {
      statusCode: 404,
      code: 'notFound'
    },
  ]

  constructor(error: any) {
    this.rawError = error;
    this.statusCode = 500;
    this.errorCode = 'unknown';
    this.message = this.rawError.message || this.rawError;
    // Find the defined error to what the rawError corresponds to.
    let found = false;
    for (let i = 0; i < this.errorDefinitions.length && !found; i++) {
      const errorDefinition = this.errorDefinitions[i];
      if (this.matchErrorDefinition(this.rawError, errorDefinition)) {
        found = true;
        this.statusCode = errorDefinition.statusCode;
        this.errorCode = errorDefinition.code;
      }
    }
  }

  private matchErrorDefinition(rawError: any, errorDefinition: {statusCode: number, code: string}) {
    return rawError === errorDefinition.code ||
      rawError?.code === errorDefinition.code ||
      rawError?.statusCode === errorDefinition.statusCode;
  }

}
