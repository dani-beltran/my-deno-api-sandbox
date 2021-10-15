export const PORT = getEnvVar("PORT");
export const ENV = getEnvVar("ENV");
export const AUTH_HOST = getEnvVar("AUTH_HOST");
export const AUTH_CLIENT_ID = getEnvVar("AUTH_CLIENT_ID");
export const AUTH_CLIENT_SECRET = getEnvVar("AUTH_CLIENT_SECRET");
export const AUTH_REALM = getEnvVar("AUTH_REALM");
export const AUTH_SSL = getEnvVar("AUTH_SSL");

/**
 * Get value of environment variable. If it's missing it will throw an error.
 * @param name 
 * @returns the value of a environment variable as a string.
 */
function getEnvVar(name: string) {
  const val = Deno.env.get(name);
  if (val == null) {
    throw `Missing environment variable ${name}`;
  }
  return val;
}