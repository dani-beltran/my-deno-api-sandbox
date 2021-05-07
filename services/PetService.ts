import { Pet } from '../models/Pet.ts';

export class PetService {
  static addPet() {//{ body }: { body: any }) {
    const testPet = {
      description: 'Just a dog',
      species: 'dog',
    };
    return Pet.create([testPet]);
  }

  static getPet({ id }: { id: number }) {
    return 'test ' + id;
  }

  static listPet() {
    const maxItems = 10;
    return Pet.limit(maxItems).all();
  }
}