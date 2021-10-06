import { Request, Response } from "../../deps.ts";
import { Controller } from "../../utils/deno-api/controller.ts";
import { emptyValidator } from "../../utils/deno-api/validators.ts";
import type { tokenResponse } from "../../utils/deno-auth/types.ts";
import * as ssoServices from './auth.services.ts';

export async function getAuthUrls(req: Request, res: Response<{authUrl: string, logoutUrl: string}>) {
  await Controller.passRequestToService(
    req,
    res,
    ssoServices.getAuthUrls,
    emptyValidator,
    req.app.locals
  );
}

export async function getTokenCtrl(req: Request, res: Response<tokenResponse>) {
  await Controller.passRequestToService(
    req,
    res,
    ssoServices.getToken,
    emptyValidator,
    req.app.locals
  );
}

// ToDo add validator
export async function getUserInfoCtrl(req: Request, res: Response<any>) {
  await Controller.passRequestToService(
    req,
    res,
    ssoServices.getUserInfo,
    emptyValidator,
    req.app.locals
  );
}
