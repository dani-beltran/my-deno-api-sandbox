import { SsoServer } from "../../utils/deno-auth/sso-server.ts";
import type { tokenResponse } from "../../utils/deno-auth/types.ts";

export function getAuthData(params: {
  authServer: SsoServer,
  redirect_uri?: string
}) {
  const redirectUri = params.redirect_uri || '';
  const authUrl = new URL(params.authServer.getAuthUrl(redirectUri));
  const logoutUrl = new URL(params.authServer.getLogoutUrl());
  return {
    clientId: params.authServer.getClientId(),
    realm: params.authServer.getRealm(),
    authPath: authUrl.pathname + authUrl.search, 
    logoutPath: logoutUrl.pathname + logoutUrl.search,
  }
}

export async function createToken(params: {
  auth_code?: string, 
  redirect_uri?: string, 
  refresh_token?: string,
  authServer: SsoServer
}) {
  let tokenResponse: tokenResponse;
  if (params.auth_code && params.redirect_uri) {
    tokenResponse = await params.authServer.requestToken(params.auth_code, params.redirect_uri);
  } else if (params.refresh_token) {
    tokenResponse = await params.authServer.refreshToken(params.refresh_token);
  } else {
    throw {code: 'notValid', message: 'Missing parameters'};
  }
  if (tokenResponse.error === 'invalid_grant') {
    throw({code: 'notValid', message: tokenResponse.error_description});
  }
  return tokenResponse;
}

export async function getUserInfo(params: {access_token: string, authServer: SsoServer}) {
  const res = await params.authServer.requestUserInfo(params.access_token);
  if (res.error) {
    throw {code: 'notAuthorized', message: res.error_description};
  }
}

