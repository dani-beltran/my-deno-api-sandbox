// deno-lint-ignore-file no-explicit-any camelcase
import { Request, Response, string } from "../../../deps.ts";
import { Controller } from "../../utils/deno-api/controller.ts";
import { ValidatorFactory } from "../../utils/deno-api/validator-factory.ts";
import type { tokenResponse } from "../../utils/deno-auth/types.ts";
import { toDefault } from "../../utils/deno-api/utils.ts";
import * as ssoServices from './auth.services.ts';

export async function getAuthDataCtrl(req: Request, res: Response<{authUrl: string, logoutUrl: string}>) {
  const referer = req.headers.get('referer');
  const validator = ValidatorFactory.buildValidatorFromSchema({
    redirect_uri: string.normalize().trim().optional().transform(toDefault(referer)),
  });
  await Controller.passRequestToService(
    req,
    res,
    ssoServices.getAuthData,
    validator,
    req.app.locals
  );
}

export async function createTokenCtrl(req: Request, res: Response<tokenResponse>) {
  const referer = req.headers.get('referer');
  const validator = ValidatorFactory.buildValidatorFromSchema({
    auth_code: string.normalize().trim().optional(),
    redirect_uri: string.normalize().trim().optional().transform(toDefault(referer)),
    refresh_token: string.normalize().trim().optional()
  });
  await Controller.passRequestToService(
    req,
    res,
    ssoServices.createToken,
    validator,
    req.app.locals
  );
}

export async function getUserInfoCtrl(req: Request, res: Response<any>) {
  const access_token = (req.headers.get('Authorization'))?.replace('Bearer ', '');
  const extraParams = {...req.app.locals, access_token};
  await Controller.passRequestToService(
    req,
    res,
    ssoServices.getUserInfo,
    ValidatorFactory.buildEmptyValidator(),
    extraParams
  );
}
