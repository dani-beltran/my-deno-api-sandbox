import { Model } from "../deps.ts";
import { ListParams } from "./ValidatorFactory.ts";

/**
 * This class provides methods for fetching DenoDB models in different ways
 */
export class ModelFetcher {
  /**
   * Returns an instance of the model fetched from the DB by Id.
   * @param modelClass 
   * @param id 
   * @returns 
   */
  static async fetchById(modelClass: typeof Model, id: number) {
    const model = await modelClass.where("id", id).get();
    if (Array.isArray(model)) {
      return model[0];
    }
    return model;
  }

  /**
   * Returns an array of instances of the model fetched from the DB.
   * @param modelClass 
   * @param params Parameters for pagination
   * @returns 
   */
  static fetchList(modelClass: typeof Model, params: ListParams) {
    const query = modelClass.offset((params.page - 1) * params.pageSize);
    query.limit(params.pageSize);
    if (params.sortBy) {
      query.orderBy(params.sortBy, params.order);
    }
    return query.all();
  }
}
