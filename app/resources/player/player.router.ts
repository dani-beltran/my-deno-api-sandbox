import { Opine, pathJoin, Router } from "../../../deps.ts";
import * as playerControllers from "./player.controllers.ts";

export const PlayerRouter = {
  /**
   * Registers the routes for this resource in the app server.
   * @param app 
   */
  registerRoutes: (app: Opine, basePath: string) => {
    const router = new Router();

    router.post("/", playerControllers.addPlayerCtrl);
    router.get("/:id", playerControllers.getPlayerCtrl);
    router.get("/", playerControllers.listPlayerCtrl);
    router.put("/:id", playerControllers.putPlayerCtrl);
    router.patch("/:id", playerControllers.patchPlayerCtrl);
    router.delete("/:id", playerControllers.deletePlayerCtrl);

    const path = pathJoin(basePath, 'players');
    app.use(path, router);
  }
}