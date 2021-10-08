import { jsonToEncodedForm } from "../generics.ts";
import { tokenResponse } from "./types.ts";

/**
 * This class represents a Single Sign-On (SSO) server. You can use it to
 * login users in the server and fetch their profile data. 
 * It only allows login and logout, registration is not supported.
 * 
 * Currently using Keycloak as an authentication system service.
 * More info here: https://www.keycloak.org/docs/9.0/securing_apps/index.html#other-openid-connect-libraries
 * 
 * The protocol followed is OpenId.
 * https://openid.net/connect/
 * 
 * */
export class SsoServer {
  private readonly AUTH_SERVER_PROTOCOL = 'openid-connect';
  private readonly clientId: string;
  private readonly clientSecret: string;
  private readonly authServerUrl: URL;
  private readonly realm: string;
  private readonly host: string;

  /**
   * @param opts.host
   * @param opts.clientId
   * @param opts.clientSecret
   * @param opts.realm (optional) If null, it will be the same as the clientId
   */
  constructor(opts: {
    host: string,
    clientId: string,
    clientSecret: string,
    realm?: string
  }) {
    this.host = opts.host;
    this.realm = opts.realm || opts.clientId;
    this.clientId = opts.clientId;
    this.clientSecret = opts.clientSecret;
    this.authServerUrl = new URL(`https://${this.host}`);
    this.authServerUrl.pathname = `/auth/realms/${this.realm}/protocol/${this.AUTH_SERVER_PROTOCOL}`;
  }

  /**
   * Requests a token to the SSO platform using an authentication code.
   * @param authCode Authentication code that was provided by the authentication server.
   * @param redirectUri The same redirect URI that was sent to the authentication server.
   */
  async requestToken(authCode: string, redirectUri: string): Promise<tokenResponse> {
    const requestBody = {
      "grant_type": 'authorization_code',
      "code": authCode,
      "client_id": this.clientId,
      "client_secret": this.clientSecret,
      "redirect_uri": redirectUri
    };
    const path = this.authServerUrl.pathname + '/token';
    const url = new URL(path, this.authServerUrl);
    const res = await fetch(url.toString(), {
      method: 'POST', 
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
      },
      body: jsonToEncodedForm(requestBody)
    });
    return res.json();
  }

  /**
   * Request a new token to the SSO platform using a refresh token.
   * @param refreshToken 
   */
  async refreshToken(refreshToken: string): Promise<tokenResponse>  {
    const requestBody = {
      "grant_type": 'refresh_token',
      "client_id": this.clientId,
      "client_secret": this.clientSecret,
      "refresh_token": refreshToken,
      "scope": 'openid%20profile'
    };
    const path = this.authServerUrl.pathname + '/token';
    const url = new URL(path, this.authServerUrl);
    const res = await fetch(url.toString(), {
      method: 'POST', 
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    });
    return res.json();
  }

  /**
   * Request the authenticated user data.
   * @param accessToken 
   */
  async requestUserInfo(accessToken: string) {
    const path = this.authServerUrl.pathname + '/userinfo';
    const url = new URL(path, this.authServerUrl);
    const res = await fetch(url.toString(), {
      method: 'GET', 
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`
      }
    });
    return res.json();
  }

  /**
   * Use this function to get the authentication server url where the user will 
   * be sent to perform the login. 
   * @returns the authentication server URL.
   */
  getAuthUrl(redirectUri: string) {
    const path = this.authServerUrl.pathname + '/auth';
    const url = new URL(path, this.authServerUrl);
    url.searchParams.set('client_id', this.clientId);
    url.searchParams.set('response_mode', 'fragment');
    url.searchParams.set('response_type', 'code');
    url.searchParams.set('scope', 'openid');
    url.searchParams.set('redirect_uri', redirectUri);
    return url.toString();
  }

  /**
   * Use this function to get the logout url where the user will be sent to 
   * perform the logout.
   * @returns the logout url.
   */
  getLogoutUrl() {
    const path = this.authServerUrl.pathname + '/logout';
    const url = new URL(path, this.authServerUrl);
    return url.toString();
  }
}
