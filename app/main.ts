import { config, signal } from "./deps.ts";
import { AppServer } from "./app-server.ts";

console.info("Loading environment variables...");
const { PORT, ENV } = config({ safe: true });

console.info("Starting server...");
const appServer = new AppServer({ port: Number(PORT), env: ENV, flushDB: false });
appServer.run();

console.info("Press Ctrl-C to stop the server");
for await (const _ of signal("SIGUSR1", "SIGINT")) {
  console.info("Server interrupted!");
  await appServer.stop();
  Deno.exit();
}
