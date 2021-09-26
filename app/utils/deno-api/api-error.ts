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
    }
    if (this.isNotValidError()) {
      this.statusCode = 400;
      this.message = this.rawError?.message || 'Bad request';
    }
  }

  isNotFoundError() {
    return this.rawError === 'notFound' 
    || this.rawError?.code === 'notFound'
    || this.rawError?.statusCode === 404;
  }

  isNotValidError() {
    return this.rawError === 'notFound' 
    || this.rawError?.code === 'notValid'
    || this.rawError?.statusCode === 400;
  }

}
