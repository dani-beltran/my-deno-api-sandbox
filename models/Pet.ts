import { Model, DataTypes } from "../deps.ts";

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
      length: 250
    },
    species: DataTypes.string(64),
    description: DataTypes.TEXT,
  };
  static defaults = {
    name: 'Anonymous',
  };
}