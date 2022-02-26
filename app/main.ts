import { AppServer } from "./app-server.ts";
import * as env from "./env.ts";

console.info("Starting server...", env.DB_FLUSH);
const appServer = new AppServer({
  port: Number(env.PORT),
  flushDB: env.DB_FLUSH ? true : false,
  authServerConfig: {
    host: env.AUTH_HOST,
    clientId: env.AUTH_CLIENT_ID,
    clientSecret: env.AUTH_CLIENT_SECRET,
    realm: env.AUTH_REALM,
    secure: env.AUTH_SSL === "true"
  },
  dbConfig: {
    host: env.DB_HOST,
    user: env.DB_USER,
    password: env.DB_PASSWORD,
    database: env.DB_DATABASE
  }
});
appServer.run();
