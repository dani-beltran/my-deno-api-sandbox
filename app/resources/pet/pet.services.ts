import { Values } from "../../deps.ts";
import { ModelFetcher } from "../../utils/ModelFetcher.ts";
import { ListParams } from "../../utils/ValidatorFactory.ts";
import { Pet, PetSchema } from "./pet.model.ts";
import { CreatedResponse } from "../../types/denodb.ts";

interface updatePetSchema extends PetSchema {
  id: number;
}

export function addPet(body: PetSchema) {
  return Pet.create([body as Values]) as any as Promise<CreatedResponse>;
}

export function getPet({ id }: { id: number }) {
  return ModelFetcher.fetchById(Pet, id);
}

export function listPet(params: ListParams) {
  return ModelFetcher.fetchList(Pet, params);
}

export function updatePet({id, ...body}: updatePetSchema ) {
  const data = body as PetSchema as Values;
  return Pet.where("id", id).update(data);
}

export function deletePet({id}: {id:number}) {
  return Pet.where('id', id).delete();
}
