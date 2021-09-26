import {
  TestSuite,
  test,
  config,
} from "../../deps.ts";
import { Species } from "./pet.model.ts";
import * as PetServices from "./pet.services.ts";
import { AppServer } from "../../app-server.ts";
import { assertEquals } from "../../deps.ts";
import { IntegrationTestFactory } from "../../utils/integration-test-factory.ts";

interface PetSuiteContext {
  appServer: AppServer,
  endpointUrl: string,
  method: string,
  petsIds: number[],
  testFactory: IntegrationTestFactory,
}

const { PORT, ENV } = config({safe: true});
const API_URL = `http://localhost:${PORT}/api`;

// POST Pet
//////////////////////////////////////////////////////////////////////////////
const postPetSuite: TestSuite<PetSuiteContext> = new TestSuite({
  name: "[Post Pet]",
  sanitizeOps: false,
  sanitizeResources: false,
  beforeAll(context: PetSuiteContext) {
    console.info = () => {};
    context.petsIds = [];
    context.endpointUrl = `${API_URL}/pets`;
    context.method = 'POST';
    context.testFactory = new IntegrationTestFactory({
      endpointUrl: context.endpointUrl, 
      method: context.method
    });
    context.appServer = new AppServer({port: Number(PORT), env: ENV, flushDB: true});
    return context.appServer.run();
  },
  afterAll(context: PetSuiteContext) {
    // Remove all inserted pets
    context.petsIds.forEach(element => {
      PetServices.deletePet({id: element});
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

test(postPetSuite, "should return 400 status code if species is missing", async (context: PetSuiteContext) => {
  const validationTest = context.testFactory.buildBodyValidationTest();
  await validationTest({age: 1, name: 'Doggy'}, 'species: Invalid species');
});

test(postPetSuite, "should return 400 status code if species is invalid", async (context: PetSuiteContext) => {
  const validationTest = context.testFactory.buildBodyValidationTest();
  await validationTest({age: 1, name: 'Doggy', species: 'unknown/invalid'}, 'species: Invalid species');
});

test(postPetSuite, "should return 400 status code if name is too short", async (context: PetSuiteContext) => {
  const validationTest = context.testFactory.buildBodyValidationTest();
  await validationTest({age: 1, name: 'aa', species: 'dog'}, 'name: Expect length to be between 3 and 40 characters (actual: 2)');
});

test(postPetSuite, "should return 400 status code if name is too long", async (context: PetSuiteContext) => {
  const validationTest = context.testFactory.buildBodyValidationTest();
  await validationTest({age: 1, name: 'a'.repeat(41), species: 'dog'}, 'name: Expect length to be between 3 and 40 characters (actual: 41)');
});

test(postPetSuite, "should return 400 status code if age is less than 0", async (context: PetSuiteContext) => {
  const validationTest = context.testFactory.buildBodyValidationTest();
  await validationTest({age: -1, species: 'dog'}, 'age: Expect value to be greater than 0 (actual: -1)');
});

test(postPetSuite, "should return 400 status code if insurancePolicy not complies to format", async (context: PetSuiteContext) => {
  const validationTest = context.testFactory.buildBodyValidationTest();
  await validationTest({age: 12, species: 'dog', insurancePolicy: 'a333'}, 'insurancePolicy: Invalid string format (expected: /^[a-z0-9]{10,64}$/)');
});

test(postPetSuite, "should return 200 status code and affect only one row", async (context: PetSuiteContext) => {
  const res = await fetch(context.endpointUrl, {
    method: context.method,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: '  test-dog  ',
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
  const pet = await PetServices.getPet({id: petId});
  assertEquals(pet.id, petId);
  assertEquals(pet.name, 'test-dog');
  assertEquals(pet.age,  15);
});

// LIST Pet
//////////////////////////////////////////////////////////////////////////////
const listPetSuite: TestSuite<PetSuiteContext> = new TestSuite({
  name: "[Get Pet]",
  sanitizeOps: false,
  sanitizeResources: false,
  beforeAll(context: PetSuiteContext) {
    console.info = () => {};
    context.petsIds = [];
    context.endpointUrl = `${API_URL}/pets`;
    context.method = 'GET';
    context.testFactory = new IntegrationTestFactory({
      endpointUrl: context.endpointUrl, 
      method: context.method
    });
    context.appServer = new AppServer({port: Number(PORT), env: ENV, flushDB: true});
    return context.appServer.run();
  },
  afterAll(context: PetSuiteContext) {
    // Remove all inserted pets
    context.petsIds.forEach(element => {
      PetServices.deletePet({id: element});
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


test(listPetSuite, "should return 400 status code if order is not valid", async (context: PetSuiteContext) => {
  const validationTest = context.testFactory.buildSearchValidation();
  await validationTest([['order', 'unknown']], 'order: Expect value to equal "desc"');
});

test(listPetSuite, "should return 400 status code if page is not a number", async (context: PetSuiteContext) => {
  const validationTest = context.testFactory.buildSearchValidation();
  await validationTest([['page', 'aa']], 'page: Unknown number value');
});

test(listPetSuite, "should return 400 status code if page is not greater than 0", async (context: PetSuiteContext) => {
  const validationTest = context.testFactory.buildSearchValidation();
  await validationTest([['page', '0']], 'page: Expect value to be greater than 0 (actual: 0)');
});

test(listPetSuite, "should return 400 status code if pageSize is not a number", async (context: PetSuiteContext) => {
  const validationTest = context.testFactory.buildSearchValidation();
  await validationTest([['pageSize', 'aa']], 'pageSize: Unknown number value');
});

test(listPetSuite, "should return 400 status code if pageSize is not greater than 0", async (context: PetSuiteContext) => {
  const validationTest = context.testFactory.buildSearchValidation();
  await validationTest([['pageSize', '0']], 'pageSize: Expect value to be greater than 0 (actual: 0)');
});

test(listPetSuite, "should return 400 status code if sortBy is too long", async (context: PetSuiteContext) => {
  const validationTest = context.testFactory.buildSearchValidation();
  await validationTest([['sortBy', 'a'.repeat(201)]], 'sortBy: Expect length to be maximum of 200 characters (actual: 201)');
});

test(listPetSuite, "should return 400 status code if sortBy does not correspond to any field", async (context: PetSuiteContext) => {
  const validationTest = context.testFactory.buildSearchValidation();
  await validationTest([['sortBy', 'unknown']], 'sortBy=unknown is not a field of Pet');
});
