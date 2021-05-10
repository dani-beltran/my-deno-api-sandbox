import { DataTypes, Model, number, Schema, string, Type } from "../deps.ts";

export enum Species {
  Dog = "dog",
  Cat = "cat",
  Mice = "mice",
}

/**
 * Interface for Pet resource
 */
export type IPet = Type<typeof Pet.schema>;

/**
 * Pet model represents the profile of a adoptable pet in the store.
 * 
 *   @property name: string | undefined;
 * 
 *   @property species: Species;
 * 
 *   @property age: number;
 * 
 *   @property inssurancePolicy: string | undefined;
 * 
 *   @property description: string | undefined;
 */
export class Pet extends Model {
  static table = "pets";
  static timestamps = true;
  static fields = {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      length: 250,
    },
    species: {
      type: DataTypes.STRING,
      length: 64,
    },
    age: {
      type: DataTypes.INTEGER,
    },
    inssurancePolicy: {
      type: DataTypes.STRING,
      length: 250,
      allowNull: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  };
  static defaults = {
    name: "Anonymous",
  };
  static schema = {
    name: string.trim().normalize().between(3, 40).optional(),
    species: Schema.enum(Species, "Invalid species"),
    age: number.integer().gt(0),
    inssurancePolicy: string.regexp(/^[a-z0-9]{10,64}$/).trim().optional(),
    description: string.trim().optional(),
  };
  static validator = Schema(Pet.schema).destruct();

}
