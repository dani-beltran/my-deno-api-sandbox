import { Opine, pathJoin, Router } from "../../deps.ts";
import * as petControllers from "./pet.controllers.ts";

export const PetRouter = {
  /**
   * Registers the routes for this resource in the app server.
   * @param app 
   */
  registerRoutes: (app: Opine, basePath: string) => {
    const router = new Router();

    router.post("/", petControllers.addPetCtrl);
    router.get("/:id", petControllers.getPetCtrl);
    router.get("/", petControllers.listPetCtrl);
    router.put("/:id", petControllers.putPetCtrl);
    router.patch("/:id", petControllers.patchPetCtrl);
    router.delete("/:id", petControllers.deletePetCtrl);

    const path = pathJoin(basePath, 'pets');
    app.use(path, router);
  }
}