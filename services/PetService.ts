import { Values } from "../deps.ts";
import { fetchById, fetchList } from "../logic/basics.ts";
import { ListParams } from "../logic/validators.ts";
import { Pet, PetSchema } from "../models/Pet.ts";

export class PetService {
  static addPet(body: PetSchema) {
    return Pet.create([body as Values]);
  }

  static getPet({ id }: { id: number }) {
    return fetchById(Pet, id);
  }

  static listPet(params: ListParams) {
    return fetchList(Pet, params);
  }
}
