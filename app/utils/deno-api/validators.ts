

/**
 * Validator that does nothing.
 * @param params 
 * @returns an array containing error as false and the params.
 */
export function emptyValidator(params: any) {
  return [false, params];
}