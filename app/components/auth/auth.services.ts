import { SsoServer } from "../../utils/deno-auth/sso-server.ts";

export function getAuthUrls(params: {
  authServer: SsoServer,
  redirect_uri?: string
}) {
  const redirectUri = params.redirect_uri || '';
  return {
    authUrl: params.authServer.getAuthUrl(redirectUri),
    logoutUrl: params.authServer.getLogoutUrl()
  }
}

export function getToken(params: {
  auth_code?: string, 
  redirect_uri?: string, 
  refresh_token?: string,
  authServer: SsoServer
}) {
  if (params.auth_code && params.redirect_uri) {
    return params.authServer.requestToken(params.auth_code, params.redirect_uri);
  } else if (params.refresh_token) {
    return params.authServer.refreshToken(params.refresh_token);
  } else {
    throw {code: 'notValid', message: 'Missing parameters'};
  }
}

export function getUserInfo(params: {access_token: string, authServer: SsoServer}) {
  return params.authServer.requestUserInfo(params.access_token);
}

