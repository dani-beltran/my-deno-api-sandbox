// deno-lint-ignore-file no-explicit-any
export class ApiError {
  rawError: any;
  statusCode = 500;
  message = '';

  constructor(error: any) {
    this.rawError = error;
    this.identifyError();
  }

  private identifyError() {
    if (this.isNotFoundError()) {
      this.statusCode = 404;
      this.message = this.rawError?.message || 'Not found';
      return;
    }
    if (this.isNotValidError()) {
      this.statusCode = 400;
      this.message = this.rawError?.message || 'Bad request';
      return;
    }
    if (this.isNotAuthorizedError()) {
      this.statusCode = 401;
      this.message = this.rawError?.message || 'Not Authorized';
    }
    if (this.isForbiddenError()) {
      this.statusCode = 403;
      this.message = this.rawError?.message || 'Forbidden';
    }
  }

  isNotFoundError() {
    return this.rawError === 'notFound' 
    || this.rawError?.code === 'notFound'
    || this.rawError?.statusCode === 404;
  }

  isNotValidError() {
    return this.rawError === 'notValid' 
    || this.rawError?.code === 'notValid'
    || this.rawError?.statusCode === 400;
  }

  isNotAuthorizedError() {
    return this.rawError === 'notAuthorized' 
    || this.rawError?.code === 'notAuthorized'
    || this.rawError?.statusCode === 401;
  }

  isForbiddenError() {
    return this.rawError === 'forbidden' 
    || this.rawError?.code === 'forbidden'
    || this.rawError?.statusCode === 403;
  }

}
