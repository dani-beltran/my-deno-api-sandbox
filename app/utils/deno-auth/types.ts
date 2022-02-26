export type authServerConfig = {
  host: string;
  clientId: string;
  clientSecret: string;
  realm?: string;
  secure?: boolean;
};

export type dbConfig = {
  host: string;
  user: string;
  password?: string;
  database: string;
};

export type tokenResponse = {
  "access_token": string;
  "expires_in": number;
  "id_token": string;
  "refresh_expires_in": number;
  "refresh_token": string;
  "scope": string;
  "token_type": string;
  "error"?: string;
  "error_description"?: string;
};
