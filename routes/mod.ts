import { Opine } from "../deps.ts";
import { PetRouter } from "./PetRouter.ts";

export function loadRoutes(app: Opine) {
  loadOtherRoutes(app);
  // Resources routes
  PetRouter.loadRoutes(app);
}

function loadOtherRoutes(app: Opine) {
  app.get("/health", (_req, res) => {
    res.send("OK");
  });
}
