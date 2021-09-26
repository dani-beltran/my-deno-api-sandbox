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
      this.message = 'Not found';
    }
  }

  isNotFoundError() {
    return this.rawError === 'notFound';
  }

}
