import { Values } from "../deps.ts";
import { ModelFetcher } from "../utils/ModelFetcher.ts";
import { ListParams } from "../utils/ValidatorFactory.ts";
import { Pet, PetSchema } from "../models/Pet.ts";

interface updatePetSchema extends PetSchema {
  id: number;
}

export abstract class PetService {
  static addPet(body: PetSchema) {
    return Pet.create([body as Values]);
  }

  static getPet({ id }: { id: number }) {
    return ModelFetcher.fetchById(Pet, id);
  }

  static listPet(params: ListParams) {
    return ModelFetcher.fetchList(Pet, params);
  }

  static updatePet({id, ...body}: updatePetSchema ) {
    const data = body as PetSchema as Values;
    return Pet.where("id", id).update(data);
  }

  static deletePet({id}: {id:number}) {
    return Pet.where('id', id).delete();
  }
}
