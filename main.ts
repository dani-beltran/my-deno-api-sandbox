import { config } from "./deps.ts";
import { AppServer } from "./AppServer.ts";

console.info("Loading environment variables...");
const { PORT, ENV } = config({ safe: true });

console.info("Starting server...");
const appServer = new AppServer({ port: Number(PORT), env: ENV });
appServer.run();

console.info("Press Ctrl-C to stop the server");
for await (const _ of Deno.signal(Deno.Signal.SIGINT)) {
  console.info("Server interrupted!");
  await appServer.stop();
  Deno.exit();
}
