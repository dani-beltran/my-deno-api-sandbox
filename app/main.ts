import { signal } from "./deps.ts";
import { AppServer } from "./app-server.ts";
import {
  AUTH_CLIENT_ID,
  AUTH_CLIENT_SECRET,
  AUTH_HOST,
  AUTH_REALM,
  ENV,
  PORT,
} from "./env.ts";

console.info("Starting server...");
const appServer = new AppServer({
  port: Number(PORT),
  env: ENV,
  flushDB: false,
  authServerConfig: {
    host: AUTH_HOST,
    clientId: AUTH_CLIENT_ID,
    clientSecret: AUTH_CLIENT_SECRET,
    realm: AUTH_REALM
  },
});
appServer.run();

console.info("Press Ctrl-C to stop the server");
for await (const _ of signal("SIGUSR1", "SIGINT")) {
  console.info("Server interrupted!");
  await appServer.stop();
  Deno.exit();
}
