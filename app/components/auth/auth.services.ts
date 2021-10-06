import { SsoServer } from "../../utils/deno-auth/sso-server.ts";

export function getAuthUrls(params: {authServer: SsoServer}) {
  return {
    authUrl: params.authServer.getAuthUrl(),
    logoutUrl: params.authServer.getLogoutUrl()
  }
}

export function getToken(params: {
  authCode?: string, 
  redirectUri?: string, 
  refreshToken?: string,
  authServer: SsoServer
}) {
  if (params.authCode && params.redirectUri) {
    return params.authServer.requestToken(params.authCode, params.redirectUri);
  } else if (params.refreshToken) {
    return params.authServer.refreshToken(params.refreshToken);
  } else {
    throw {code: 'notValid', message: 'Missing parameters'};
  }
}

export function getUserInfo(params: {token: string, authServer: SsoServer}) {
  return params.authServer.requestUserInfo(params.token);
}

