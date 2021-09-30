import { Values } from "../../deps.ts";
import { fetchById, fetchList, create, updateById, deleteById } from "../../utils/denodb-extended/mod.ts";
import { ListParams } from "../../utils/denodb-extended/types.ts";
import { Country, CountrySchema } from "./country.model.ts";

interface updateCountrySchema extends CountrySchema {
  id: number;
}

export function addCountry(body: CountrySchema) {
  return create(Country, body as Values);
}

export function getCountry({ id }: { id: number }) {
  return fetchById(Country, id);
}

export function listCountry(params: ListParams) {
  return fetchList(Country, params);
}

export function updateCountry({id, ...body}: updateCountrySchema ) {
  const values = body as CountrySchema as Values;
  return updateById(Country, id, values);
}

export function deleteCountry({id}: {id:number}) {
  return deleteById(Country, id);
}
