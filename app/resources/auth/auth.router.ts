import { pathJoin, string } from "../../../deps.ts";
import { getBodyValidation, getQueryValidation, getRouter } from "../../utils/deno-api/api-methods.ts";
import { getController } from "../../utils/deno-api/api-methods.ts";
import { extractAccessToken } from "../../utils/deno-api/middleware-fn.ts";
import { IApiRouter } from "../../utils/deno-api/types.ts";
import { getUserInfo } from "./auth.services.ts";
import { createToken, getAuthData } from "./auth.services.ts";

export const AuthRouter: IApiRouter = {
  /**
   * Returns the router path
   * @param basePath
   * @returns
   */
  getPath: (basePath: string) => {
    return pathJoin(basePath, "auth");
  },
  /**
   * Returns its router
   */
  getRouter: () => {
    return getRouter([{
      method: "get",
      path: "/",
      validation: [ getQueryValidation({
        redirect_uri: string.normalize().trim(),
      })],
      controller: getController(getAuthData),
    }, {
      method: "post",
      path: "/token",
      validation: [ getBodyValidation({
        auth_code: string.normalize().trim().optional(),
        redirect_uri: string.normalize().trim(),
        refresh_token: string.normalize().trim().optional()
      })],
      controller: getController(createToken),
    }, {
      method: "get",
      path: "/user-info",
      beforeValidation: [extractAccessToken],
      controller: getController(getUserInfo),
    }]);
  },
};
