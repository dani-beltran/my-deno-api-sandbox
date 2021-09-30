import {
  Database,
  json,
  Opine,
  opine,
  pathJoin,
  Server,
  SQLite3Connector,
} from "./deps.ts";
import { Pet } from "./resources/pet/pet.model.ts";
import { PetRouter } from "./resources/pet/pet.router.ts";
import { Player } from "./resources/player/player.model.ts";
import { PlayerRouter } from "./resources/player/player.router.ts";

/**
 * The application server that runs the RESTful API.
 * Register here the routes and the models of the resources.
 */
export class AppServer {
  public db?: Database;
  public port: number;
  public env: string;
  public debug: boolean;
  private httpServer?: Server;
  private flushDB: boolean;

  constructor(opts: {
    port: number;
    env?: string;
    debug?: boolean;
    flushDB?: boolean;
  }) {
    this.env = opts.env ?? "production";
    this.port = opts.port;
    this.debug = opts.debug ?? false;
    this.flushDB = opts.flushDB ?? false;
  }

  /**
   * Runs the server
   */
  async run() {
    this.db = this.connectDB();
    const opineServer = opine();
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
      Player
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
