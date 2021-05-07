import { Values } from "../deps.ts";
import { Pet, PetSchema } from "../models/Pet.ts";

export class PetService {
  static addPet(body: PetSchema) {
    return Pet.create([body as Values]);
  }

  static getPet({ id }: { id: number }) {
    return Pet.fetchById(id);
  }

  static listPet() {
    const maxItems = 10;
    return Pet.limit(maxItems).all();
  }
}
