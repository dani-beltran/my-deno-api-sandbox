// deno-lint-ignore-file no-explicit-any
import { Request, Response, string } from "../../deps.ts";
import { Controller } from "../../utils/deno-api/controller.ts";
import { buildValidatorFromSchema } from "../../utils/deno-api/validators.ts";
import type { tokenResponse } from "../../utils/deno-auth/types.ts";
import { toDefault } from "../../utils/denodb-extended/utils.ts";
import * as ssoServices from './auth.services.ts';

export async function getAuthUrls(req: Request, res: Response<{authUrl: string, logoutUrl: string}>) {
  const referer = req.headers.get('referer');
  const validator = buildValidatorFromSchema({
    redirect_uri: string.normalize().trim().optional().transform(toDefault(referer)),
  });
  await Controller.passRequestToService(
    req,
    res,
    ssoServices.getAuthUrls,
    validator,
    req.app.locals
  );
}

export async function getTokenCtrl(req: Request, res: Response<tokenResponse>) {
  const referer = req.headers.get('referer');
  const validator = buildValidatorFromSchema({
    auth_code: string.normalize().trim().optional(),
    redirect_uri: string.normalize().trim().optional().transform(toDefault(referer)),
    refresh_token: string.normalize().trim().optional()
  });
  await Controller.passRequestToService(
    req,
    res,
    ssoServices.getToken,
    validator,
    req.app.locals
  );
}

// ToDo add validator
export async function getUserInfoCtrl(req: Request, res: Response<any>) {
  const validator = buildValidatorFromSchema({
    access_token: string.normalize().trim()
  });
  await Controller.passRequestToService(
    req,
    res,
    ssoServices.getUserInfo,
    validator,
    req.app.locals
  );
}
