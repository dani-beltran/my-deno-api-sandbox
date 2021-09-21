import {
  TestSuite,
  test,
  config,
} from "../../deps.ts";
import { Species } from "../../models/Pet.ts";
import { PetService } from "../../services/PetService.ts";
import { AppServer } from "../../AppServer.ts";
import { assertEquals } from "https://deno.land/std@0.105.0/testing/asserts.ts";

interface PetSuiteContext {
  appServer: AppServer,
  petsIds: number[],
}

const { PORT, ENV } = config({safe: true});
const API_URL = `http://localhost:${PORT}/api`;
const postPetSuite: TestSuite<PetSuiteContext> = new TestSuite({
  name: "[Post Pet]",
  sanitizeOps: false,
  sanitizeResources: false,
  beforeAll(context: PetSuiteContext) {
    console.info = () => {};
    context.petsIds = [];
    context.appServer = new AppServer({port: Number(PORT), env: ENV});
    return context.appServer.run();
  },
  afterAll(context: PetSuiteContext) {
    // Remove all inserted pets
    context.petsIds.forEach(element => {
      PetService.deletePet({id: element});
    });
    return context.appServer.stop();
  },
  beforeEach() {
    // Do nothing
  },
  afterEach() {
    // Do nothing
  },
});

test(postPetSuite, "should return 200 status code and affect only one row", async (context: PetSuiteContext) => {
  const res = await fetch(API_URL + '/pets/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: 'test-dog',
      age: 15,
      species: Species.Dog
    }),
  });
  const resBody = await res.json();
  assertEquals(res.status, 200);
  assertEquals(resBody.affectedRows, 1);
  context.petsIds.push(resBody.lastInsertId);
}); 

test(postPetSuite, "should had created the pet", async (context: PetSuiteContext) => {
  const petId = context.petsIds[context.petsIds.length - 1];
  const pet = await PetService.getPet({id: petId});
  assertEquals(pet.id, petId);
  assertEquals(pet.name, 'test-dog');
  assertEquals(pet.age,  15);
});
