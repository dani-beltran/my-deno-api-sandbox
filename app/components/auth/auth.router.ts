import { Opine, pathJoin, Router } from "../../deps.ts";
import * as ssoControllers from './auth.controllers.ts';

export const AuthRouter = {
  /**
   * Registers the routes for this resource in the app server.
   * @param app 
   */
  registerRoutes: (app: Opine, basePath: string) => {
    const router = new Router();

    router.get("/urls", ssoControllers.getAuthUrls);
    router.get("/token", ssoControllers.getTokenCtrl);
    router.get("/user-info", ssoControllers.getUserInfoCtrl);
    
    const path = pathJoin(basePath, 'auth');
    app.use(path, router);
  }
}