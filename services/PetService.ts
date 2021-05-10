import { Values } from "../deps.ts";
import { ModelFetcher } from "../utils/ModelFetcher.ts";
import { ListParams } from "../utils/ValidatorFactory.ts";
import { Pet, IPet } from "../models/Pet.ts";

interface IUpdatePet extends IPet {
  id: number;
}

export class PetService {
  static addPet(body: IPet) {
    return Pet.create([body as Values]);
  }

  static getPet({ id }: { id: number }) {
    return ModelFetcher.fetchById(Pet, id);
  }

  static listPet(params: ListParams) {
    return ModelFetcher.fetchList(Pet, params);
  }

  static updatePet({id, ...body}: IUpdatePet ) {
    const data = body as IPet as Values;
    return Pet.where("id", id).update(data);
  }

  static deletePet({id}: {id:number}) {
    return Pet.where('id', id).delete();
  }
}
