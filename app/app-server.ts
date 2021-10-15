import {
  Database,
  json,
  opine,
  Opine,
  pathJoin,
  Server,
  SQLite3Connector,
} from "../deps.ts";
import { Country } from "./resources/country/country.model.ts";
import { CountryRouter } from "./resources/country/country.router.ts";
import { Pet } from "./resources/pet/pet.model.ts";
import { PetRouter } from "./resources/pet/pet.router.ts";
import { Player } from "./resources/player/player.model.ts";
import { PlayerRouter } from "./resources/player/player.router.ts";
import { SsoServer } from "./utils/deno-auth/sso-server.ts";
import { AuthRouter } from "./resources/auth/auth.router.ts";
import type { authServerConfig } from "./utils/deno-auth/types.ts";


/**
 * The application server that runs the RESTful API.
 * Register here the routes and the models of the resources.
 */
export class AppServer {
  private db?: Database;
  private httpServer?: Server;
  private readonly flushDB: boolean;
  public readonly debug: boolean;
  public readonly env: string;
  public readonly port: number;
  public readonly authServerConfig: authServerConfig;

  constructor(opts: {
    port: number;
    env?: string;
    debug?: boolean;
    flushDB?: boolean;
    authServerConfig: authServerConfig;
  }) {
    this.env = opts.env ?? "production";
    this.port = opts.port;
    this.debug = opts.debug ?? false;
    this.flushDB = opts.flushDB ?? false;
    this.authServerConfig = opts.authServerConfig;
  }

  /**
   * Runs the server
   */
  async run() {
    this.db = this.connectDB();
    const opineServer = opine();
    opineServer.locals = {
      authServer: this.connectAuthServer()
    };
    this.registerModels(this.db);
    await this.db.sync({drop: this.flushDB});
    this.registerMiddleware(opineServer);
    this.registerRoutes(opineServer, "/api");
    this.httpServer = opineServer.listen(this.port, () => {
      console.info(`HTTP Server running on port ${this.port}`);
    });
  }

  /**
   * Stops the server.
   */
  async stop() {
    await Promise.all([
      this.db?.close(),
      this.httpServer?.close(),
    ]);
  }

  /**
   * Connects to the database and returns the connection.
   * @returns
   */
  private connectDB() {
    const str = (this.env !== "production") ? "." + this.env : "";
    const connector = new SQLite3Connector({
      filepath: `./database${str}.sqlite`,
    });
    return new Database(connector, { debug: true });
  }

  /**
   * Connects to the authentication server and returns a object with the interface
   * to communicate with it.
   * @param authServerConfig 
   * @returns 
   */
  private connectAuthServer() {
    return new SsoServer({
      host: this.authServerConfig.host,
      clientId: this.authServerConfig.clientId,
      clientSecret: this.authServerConfig.clientSecret,
      realm: this.authServerConfig.realm,
      secure: this.authServerConfig.secure,
    });
  }

  /**
   * Register middleware functions to run for all the routes.
   * @param app 
   */
  private registerMiddleware(app: Opine) {
    app.use(json());
  }

  /**
   * Register the models in the app server's DB.
   * @param db
   */
  private registerModels(db: Database) {
    // In case of pivot models created with Relationships.manyToMany,
    // it is good practice to put them first
    db.link([
      Pet,
      Player,
      Country
    ]);
  }

  /**
   * Register the routes in the app server.
   * @param app
   */
  private registerRoutes(app: Opine, basePath = "") {
    this.registerOtherRoutes(app, basePath);
    // Resources routes
    PetRouter.registerRoutes(app, basePath);
    PlayerRouter.registerRoutes(app, basePath);
    CountryRouter.registerRoutes(app, basePath);
    AuthRouter.registerRoutes(app, basePath);
  }

  /**
   * Register routes not corresponding to any resource.
   * @param app
   * @param basePath
   */
  private registerOtherRoutes(app: Opine, basePath: string) {
    const healthPath = pathJoin(basePath, "health");
    app.get(healthPath, (_req, res) => {
      res.send("OK");
    });
  }
}
