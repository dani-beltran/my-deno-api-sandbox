import { Opine, pathJoin, Router } from "../../deps.ts";
import * as countryControllers from "./country.controllers.ts";

export const CountryRouter = {
  /**
   * Registers the routes for this resource in the app server.
   * @param app 
   */
  registerRoutes: (app: Opine, basePath: string) => {
    const router = new Router();

    router.post("/", countryControllers.addCountryCtrl);
    router.get("/:id", countryControllers.getCountryCtrl);
    router.get("/", countryControllers.listCountryCtrl);
    router.put("/:id", countryControllers.putCountryCtrl);
    router.patch("/:id", countryControllers.patchCountryCtrl);
    router.delete("/:id", countryControllers.deleteCountryCtrl);

    const path = pathJoin(basePath, 'countries');
    app.use(path, router);
  }
}