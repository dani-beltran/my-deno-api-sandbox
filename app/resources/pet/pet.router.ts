import { Opine, pathJoin, Router } from "../../../deps.ts";
import { getBodyValidation, getController } from "../../utils/deno-api/api-methods.ts";
import * as petControllers from "./pet.controllers.ts";
import { Pet } from "./pet.model.ts";
import { addPet } from "./pet.services.ts";

export const PetRouter = {
  /**
   * Registers the routes for this resource in the app server.
   * @param app 
   */
  registerRoutes: (app: Opine, basePath: string) => {
    const router = new Router();

    router.post("/", getBodyValidation(Pet.schema), getController(addPet, 201));
    router.get("/:id", petControllers.getPetCtrl);
    router.get("/", petControllers.listPetCtrl);
    router.put("/:id", petControllers.putPetCtrl);
    router.patch("/:id", petControllers.patchPetCtrl);
    router.delete("/:id", petControllers.deletePetCtrl);

    const path = pathJoin(basePath, 'pets');
    app.use(path, router);
  }
}