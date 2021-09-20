import { Opine, Router } from "../deps.ts";
import { PetController } from "../controllers/PetController.ts";

export abstract class PetRouter {
  /**
   * Registers the routes for this resource in the app server.
   * @param app 
   */
  static registerRoutes(app: Opine, basePath: string) {
    const router = new Router();

    router.post("/", PetController.addPet);
    router.get("/:id", PetController.getPet);
    router.get("/", PetController.listPet);
    router.put("/:id", PetController.putPet);
    router.patch("/:id", PetController.patchPet);
    router.delete("/:id", PetController.deletePet);

    app.use(`${basePath}/pets`, router);
  }
}
