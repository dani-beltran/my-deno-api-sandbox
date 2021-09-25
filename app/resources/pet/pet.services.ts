import { Values } from "../../deps.ts";
import { fetchById, fetchList, create, updateById, deleteById } from "../../utils/denodb-extended.ts";
import { ListParams } from "../../utils/ValidatorFactory.ts";
import { Pet, PetSchema } from "./pet.model.ts";

interface updatePetSchema extends PetSchema {
  id: number;
}

export function addPet(body: PetSchema) {
  return create(Pet, body as Values);
}

export function getPet({ id }: { id: number }) {
  return fetchById(Pet, id);
}

export function listPet(params: ListParams) {
  return fetchList(Pet, params);
}

export function updatePet({id, ...body}: updatePetSchema ) {
  const values = body as PetSchema as Values;
  return updateById(Pet, id, values);
}

export function deletePet({id}: {id:number}) {
  return deleteById(Pet, id);
}
