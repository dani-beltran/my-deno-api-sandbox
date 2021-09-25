//
// This file contains functions and types for extending and wrapping denodb lib.
//
// deno-lint-ignore-file no-explicit-any
import { Model, Values } from "../deps.ts";
import { ListParams } from "./ValidatorFactory.ts";

/**
 * Extended Model class type.
 * Based on DenoDB models, but with extended properties from other libs like:
 * - "computed-types"
 */
 export type IModel = {
  schema: { [key: string]: any }
} & typeof Model;

/**
 * The actual response from Model.create() in denodb v1.0.39 using sqlite.
 */
export type CreatedResponse = { affectedRows: number, lastInsertId: number };

/**
 * The actual response from Model.update() and Model.delete() in denodb v1.0.39 using sqlite.
 */
export type UpdatedResponse = { affectedRows: number };

/**
 * Creates the model in the DB with the given values. 
 * @param modelClass 
 * @param values Fields and their values to insert into the model.
 * @returns feedback on the creation, like lastInsertId and affectedRows
 */
 export function create(modelClass: typeof Model, values: Values) {
  return modelClass.create([values as Values]) as any as Promise<CreatedResponse>;
}

/**
 * Deletes the model in the DB.
 * @param modelClass 
 * @param id 
 * @returns 
 */
export function deleteById(modelClass: typeof Model, id: number) {
  return modelClass.where('id', id).delete() as any as Promise<UpdatedResponse>;
}

/**
 * @param modelClass 
 * @param id 
 * @returns an instance of the model fetched from the DB by Id.
 */
export async function fetchById(modelClass: typeof Model, id: number) {
  const model = await modelClass.where("id", id).get();
  if (Array.isArray(model)) {
    return model[0];
  }
  return model;
}

/**
 * @param modelClass 
 * @param params Parameters for pagination
 * @returns an array of instances of the model fetched from the DB.
 */
export function fetchList(modelClass: typeof Model, params: ListParams) {
  const query = modelClass.offset((params.page - 1) * params.pageSize);
  query.limit(params.pageSize);
  if (params.sortBy) {
    query.orderBy(params.sortBy, params.order);
  }
  return query.all();
}

/**
 * Updates the model in the DB with the given values.
 * @param modelClass 
 * @param id 
 * @param values 
 * @returns 
 */
export function updateById(modelClass: typeof Model, id: number, values: Values) {
  return modelClass.where("id", id).update(values) as any as Promise<UpdatedResponse>;
}