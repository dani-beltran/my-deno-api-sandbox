import {
  Database,
  json,
  opine,
  Server,
  SQLite3Connector,
} from "./deps.ts";
import { registerRoutes } from "./routes/mod.ts";
import { registerModels } from "./models/mod.ts";

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
    registerModels(this.db);
    await this.db.sync();
    opineServer.use(json());
    registerRoutes(opineServer, '/api');
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
}
