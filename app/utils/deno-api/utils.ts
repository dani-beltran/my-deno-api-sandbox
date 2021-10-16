/**
 * @param defaultValue 
 * @returns a function that can be used by computed-types Schema.transform to set a default
 * value in the validation process.
 */
export function toDefault<T, K>(defaultValue: K) {
  return (x: T) => {
    if (x == null) {
      return defaultValue;
    } else {
      return x;
    }
  };
}