import { Database } from "../deps.ts";
import { Pet } from "./Pet.ts";

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