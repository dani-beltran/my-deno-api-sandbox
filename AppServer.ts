import { Database, SQLite3Connector, opine, Opine, Server } from "./deps.ts";
import { loadRoutes } from './routes/mod.ts';
import { Pet } from "./models/Pet.ts";


export class AppServer {
  public db: Database;
  public port: number;
  public env: string;
  public debug: boolean;
  private opineServer: Opine;
  private httpServer?: Server;

  constructor(opts: {
    port: number,
    env?: string,
    debug?: boolean
  }) {
    this.env = opts.env ?? 'production';
    this.port = opts.port;
    this.debug = opts.debug ?? false;
    this.validation();
    this.db = this.connectDB();
    this.opineServer = opine();
  }

  validation() {
    if (Number.isInteger(this.port) == false) {
      throw new Error(`Server port is not valid. Value: ${this.port}`);
    } 
  }

  async run() {
    this.registedModels();
    await this.db.sync();
    loadRoutes(this.opineServer);
    this.httpServer = this.opineServer.listen(this.port, () => {
      console.log(`HTTP Server running on port ${this.port}`)
    });
  }

  async stop() {
    await Promise.all([
      this.db.close(),
      this.httpServer?.close()
    ]);
  }

  private connectDB() {
    const str = (this.env !== 'production') ? '.'+this.env : '';
    const connector = new SQLite3Connector({
      filepath: `./database${str}.sqlite`,
    });
    return new Database(connector, {debug: true});
  }

  private registedModels() {
    // In case of pivot models created with Relationships.manyToMany, 
    // it is good practice to put them first
    this.db.link([
      Pet
    ])
  }
}

