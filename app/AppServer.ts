import {
  Database,
  json,
  opine,
  Opine,
  pathJoin,
  Server,
  SQLite3Connector,
} from "./deps.ts";
import { Pet } from "./resources/pet/Pet.ts";
import { PetRouter } from "./resources/pet/PetRouter.ts";

export class AppServer {
  public db?: Database;
  public port: number;
  public env: string;
  public debug: boolean;
  private httpServer?: Server;

  constructor(opts: {
    port: number;
    env?: string;
    debug?: boolean;
  }) {
    this.env = opts.env ?? "production";
    this.port = opts.port;
    this.debug = opts.debug ?? false;
    this.validation();
  }

  validation() {
    if (Number.isInteger(this.port) == false) {
      throw new Error(`Server port is not valid. Value: ${this.port}`);
    }
  }

  async run() {
    this.db = this.connectDB();
    const opineServer = opine();
    this.registerModels(this.db);
    await this.db.sync();
    opineServer.use(json());
    this.registerRoutes(opineServer, '/api');
    this.httpServer = opineServer.listen(this.port, () => {
      console.info(`HTTP Server running on port ${this.port}`);
    });
  }

  async stop() {
    await Promise.all([
      this.db?.close(),
      this.httpServer?.close(),
    ]);
  }

  private connectDB() {
    const str = (this.env !== "production") ? "." + this.env : "";
    const connector = new SQLite3Connector({
      filepath: `./database${str}.sqlite`,
    });
    return new Database(connector, { debug: true });
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
  ]);
}

/**
 * Register the routes in the app server.
 * @param app 
 */
 private registerRoutes(app: Opine, basePath = '') {
  this.registerOtherRoutes(app, basePath);
  // Resources routes
  PetRouter.registerRoutes(app, basePath);
}

private registerOtherRoutes(app: Opine, basePath: string) {
  const healthPath = pathJoin(basePath, 'health');
  app.get(healthPath, (_req, res) => {
    res.send("OK");
  });
}

}
