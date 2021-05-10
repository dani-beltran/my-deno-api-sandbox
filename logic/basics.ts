import { Model } from "../deps.ts";
import { ListParams } from "./ValidatorFactory.ts";

export async function fetchById(model: typeof Model, id: number) {
  const pet = await model.where("id", id).get() as Model;
  return pet;
}

export function fetchList(model: typeof Model, params: ListParams) {
  const query = model.offset((params.page - 1) * params.pageSize);
    query.limit(params.pageSize);
    if (params.sortBy) {
      query.orderBy(params.sortBy, params.order);
    }
    return query.all();
}