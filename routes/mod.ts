import { Opine } from "../deps.ts";
import { PetRouter } from "./PetRouter.ts";

/**
 * Register the routes in the app server.
 * @param app 
 */
export function registerRoutes(app: Opine, basePath = '') {
  registerOtherRoutes(app, basePath);
  // Resources routes
  PetRouter.registerRoutes(app, basePath);
}

function registerOtherRoutes(app: Opine, basePath: string) {
  app.get(`${basePath}/health`, (_req, res) => {
    res.send("OK");
  });
}
