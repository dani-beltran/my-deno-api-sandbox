import { Opine, Router } from "../deps.ts";
import { PetController } from "../controllers/PetController.ts";

export abstract class PetRoutes {
  static load(app: Opine) {
    const router = new Router();

    router.post("/", PetController.addPet);
    router.get("/:id", PetController.getPet);
    router.get("/", PetController.listPet);
    router.put("/:id", PetController.putPet);
    router.patch("/:id", PetController.patchPet);
    router.delete("/:id", PetController.deletePet);

    app.use("/pets", router);
  }
}
