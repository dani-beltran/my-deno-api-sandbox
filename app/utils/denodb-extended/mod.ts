// deno-lint-ignore-file no-explicit-any
//
// This file contains methods for extending and wrapping denodb lib.
// It's extended with features from libs like "computed-types" 
//
import { Model, Values } from "./deps.ts";
import { ListParams, CreatedResponse, UpdatedResponse } from "./types.ts";
enum errors {
  notFound = 'notFound'
}

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
export async function deleteById(modelClass: typeof Model, id: number) {
  const res = await modelClass.where('id', id).delete() as any as UpdatedResponse;
  if (res.affectedRows === 0) {
    throw errors.notFound;
  }
  return res;
}

/**
 * @param modelClass 
 * @param id 
 * @returns an instance of the model fetched from the DB by Id.
 */
export async function fetchById(modelClass: typeof Model, id: number) {
  let model = await modelClass.where("id", id).get();
  if (Array.isArray(model)) {
    model = model[0];
  }
  if (!model) {
    throw errors.notFound;
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
export async function updateById(modelClass: typeof Model, id: number, values: Values) {
  const res = await modelClass.where("id", id).update(values) as any as UpdatedResponse;
  if (res.affectedRows === 0) {
    throw errors.notFound;
  }
  return res;
}