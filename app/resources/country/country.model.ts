import { DataTypes, Model, Schema, string, Type } from "../../../deps.ts";

/**
 * Country model represents a country from the world.
 * @property name: string;
 * @property code: string;
 */
export class Country extends Model {
  static table = "countries";
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
    code: {
      type: DataTypes.STRING,
      length: 32,
    },
  };
  static defaults = {};
  static schema = {
    name: string.trim().normalize().between(3, 250),
    code: string.trim().normalize().between(2, 7),
  };
  static validator = Schema(Country.schema).destruct();
}

/**
 * Interface for Country resource
 */
 export type CountrySchema = Type<typeof Country.schema>;