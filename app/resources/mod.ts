import { Database, pathJoin, Opine} from "../deps.ts";
import { Pet } from "./pet/Pet.ts";
import { PetRouter } from "./pet/PetRouter.ts";

/**
 * Register the models in the app server's DB.
 * @param db 
 */
 export function registerModels(db: Database) {
  // In case of pivot models created with Relationships.manyToMany,
  // it is good practice to put them first
  db.link([
    Pet,
  ]);
}

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
  const healthPath = pathJoin(basePath, 'health');
  app.get(healthPath, (_req, res) => {
    res.send("OK");
  });
}
