import { Opine } from "../deps.ts";
import { PetRoutes } from "./PetRoutes.ts";

export function loadRoutes(app: Opine) {
  loadOtherRoutes(app);
  // Resources routes
  PetRoutes.load(app);
}

function loadOtherRoutes(app: Opine) {
  app.get("/health", (_req, res) => {
    res.send("OK");
  });
}
