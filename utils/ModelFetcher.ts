import { Model } from "../deps.ts";
import { ListParams } from "./ValidatorFactory.ts";

/**
 * This class provides methods for fetching models in different ways
 */
export class ModelFetcher {
  static async fetchById(modelClass: typeof Model, id: number) {
    const model = await modelClass.where("id", id).get() as Model;
    return model;
  }

  static fetchList(modelClass: typeof Model, params: ListParams) {
    const query = modelClass.offset((params.page - 1) * params.pageSize);
    query.limit(params.pageSize);
    if (params.sortBy) {
      query.orderBy(params.sortBy, params.order);
    }
    return query.all();
  }
}
