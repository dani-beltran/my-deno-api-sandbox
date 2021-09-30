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
  method: string,
  endpointUrl: string,
  headers: HeadersInit,
  petsIds: number[],
  testFactory: IntegrationTestFactory,
}

const { PORT, ENV } = config({safe: true});
const API_URL = `http://localhost:${PORT}/api`;

// CREATE Pet
//////////////////////////////////////////////////////////////////////////////
const postPetSuite: TestSuite<PetSuiteContext> = new TestSuite({
  name: "Create Pet endpoint",
  sanitizeOps: false,
  sanitizeResources: false,
  beforeAll(context: PetSuiteContext) {
    console.info = () => {};
    context.petsIds = [];
    context.method = 'POST';
    context.endpointUrl = `${API_URL}/pets`;
    context.headers = {
      'Content-Type': 'application/json',
    };
    context.testFactory = new IntegrationTestFactory({
      endpointUrl: context.endpointUrl, 
      headers: context.headers,
      method: context.method
    });
    context.appServer = new AppServer({port: Number(PORT), env: ENV, flushDB: true});
    return context.appServer.run();
  },
  afterAll(context: PetSuiteContext) {
    // No need to remove data from DB since it's flushed at the start of each TestSuite
    // Just stop the app server
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
    headers: context.headers,
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

test(postPetSuite, "should had created the resource", async (context: PetSuiteContext) => {
  const lastPetId = context.petsIds[context.petsIds.length - 1];
  const pet = await PetServices.getPet({id: lastPetId});
  assertEquals(pet.id, lastPetId);
  assertEquals(pet.name, 'test-dog');
  assertEquals(pet.age,  15);
});


// LIST Pet
//////////////////////////////////////////////////////////////////////////////
const listPetSuite: TestSuite<PetSuiteContext> = new TestSuite({
  name: "List Pet endpoint",
  sanitizeOps: false,
  sanitizeResources: false,
  beforeAll(context: PetSuiteContext) {
    console.info = () => {};
    context.petsIds = [];
    context.method = 'GET';
    context.endpointUrl = `${API_URL}/pets`;
    context.headers = {
      'Content-Type': 'application/json',
    };
    context.testFactory = new IntegrationTestFactory({
      endpointUrl: context.endpointUrl, 
      headers: context.headers,
      method: context.method
    });
    context.appServer = new AppServer({port: Number(PORT), env: ENV, flushDB: true});
    return context.appServer.run().then(() => {
      const data = [
        {
          name: 'animal1',
          species: Species.Cat,
          age: 10,
          insurancePolicy: undefined,
          description: undefined
        },
        {
          name: 'animal2',
          species: Species.Dog,
          age: 2,
          insurancePolicy: undefined,
          description: undefined
        },
        {
          name: 'animal3',
          species: Species.Dog,
          age: 3,
          insurancePolicy: undefined,
          description: undefined
        },
        {
          name: 'animal4',
          species: Species.Mice,
          age: 4,
          insurancePolicy: undefined,
          description: undefined
        }
      ];
      data.forEach(async (pet) => {
        const res = await PetServices.addPet(pet);
        context.petsIds.push(res.lastInsertId);
      });
    })
  },
  afterAll(context: PetSuiteContext) {
  // No need to remove data from DB since it's flushed at the start of each TestSuite
  // Just stop the app server
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

test(listPetSuite, "should return 3 elements if page=1 and pageSize=3", async (context: PetSuiteContext) => {
  const url = `${context.endpointUrl}?page=1&pageSize=3`;
  const res = await fetch(url, {
    method: context.method,
    headers: context.headers
  });
  const resBody = await res.json();
  assertEquals(res.status, 200);
  assertEquals(resBody.length, 3);
});

test(listPetSuite, "should return elements sorted by name in descendent order if sortBy=name and order=desc", async (context: PetSuiteContext) => {
  const url = `${context.endpointUrl}?order=desc&sortBy=name`;
  const res = await fetch(url, {method: context.method, headers: context.headers});
  const resBody = await res.json();
  assertEquals(res.status, 200);
  assertEquals(resBody[0].name, 'animal4');
  assertEquals(resBody[1].name, 'animal3');
  assertEquals(resBody[2].name, 'animal2');
  assertEquals(resBody[3].name, 'animal1');
});

test(listPetSuite, "should return elements sorted by age in ascendent order if sortBy=age and order=asc", async (context: PetSuiteContext) => {
  const url = `${context.endpointUrl}?order=asc&sortBy=age`;
  const res = await fetch(url, {method: context.method, headers: context.headers});
  const resBody = await res.json();
  assertEquals(res.status, 200);
  assertEquals(resBody[0].age, 2);
  assertEquals(resBody[1].age, 3);
  assertEquals(resBody[2].age, 4);
  assertEquals(resBody[3].age, 10);
});


// GET Pet
//////////////////////////////////////////////////////////////////////////////

const getPetSuite: TestSuite<PetSuiteContext> = new TestSuite({
  name: "Get Pet endpoint",
  sanitizeOps: false,
  sanitizeResources: false,
  beforeAll(context: PetSuiteContext) {
    console.info = () => {};
    context.petsIds = [];
    context.method = 'GET';
    context.endpointUrl = `${API_URL}/pets`;
    context.headers = {
      'Content-Type': 'application/json',
    };
    context.testFactory = new IntegrationTestFactory({
      endpointUrl: context.endpointUrl, 
      headers: context.headers,
      method: context.method
    });
    context.appServer = new AppServer({port: Number(PORT), env: ENV, flushDB: true});
    return context.appServer.run().then(() => {
      const data = [
        {
          name: 'animal1',
          species: Species.Cat,
          age: 10,
          insurancePolicy: undefined,
          description: undefined
        },
        {
          name: 'animal2',
          species: Species.Dog,
          age: 2,
          insurancePolicy: undefined,
          description: undefined
        }
      ];
      data.forEach(async (pet) => {
        const res = await PetServices.addPet(pet);
        context.petsIds.push(res.lastInsertId);
      });
    })
  },
  afterAll(context: PetSuiteContext) {
  // No need to remove data from DB since it's flushed at the start of each TestSuite
  // Just stop the app server
    return context.appServer.stop();
  },
  beforeEach() {
    // Do nothing
  },
  afterEach() {
    // Do nothing
  },
});

test(getPetSuite, "should return 404 not found if pet doesn't exist", async (context: PetSuiteContext) => {
  const url = `${context.endpointUrl}/999`;
  const res = await fetch(url, {method: context.method, headers: context.headers});
  const resBody = await res.text();
  assertEquals(res.status, 404);
  assertEquals(resBody, 'Not found');
});

test(getPetSuite, "should return a pet", async (context: PetSuiteContext) => {
  const url = `${context.endpointUrl}/2`;
  const res = await fetch(url, {method: context.method, headers: context.headers});
  const resBody = await res.json();
  assertEquals(res.status, 200);
  assertEquals(resBody.name, 'animal2');
});



// UPDATE Pet
//////////////////////////////////////////////////////////////////////////////

const updatePetSuite: TestSuite<PetSuiteContext> = new TestSuite({
  name: "Update Pet endpoint",
  sanitizeOps: false,
  sanitizeResources: false,
  beforeAll(context: PetSuiteContext) {
    console.info = () => {};
    context.petsIds = [];
    context.method = 'PUT';
    context.endpointUrl = `${API_URL}/pets`;
    context.headers = {
      'Content-Type': 'application/json',
    };
    context.testFactory = new IntegrationTestFactory({
      endpointUrl: context.endpointUrl, 
      headers: context.headers,
      method: context.method
    });
    context.appServer = new AppServer({port: Number(PORT), env: ENV, flushDB: true});
    return context.appServer.run().then(() => {
      const data = [
        {
          name: 'animal1',
          species: Species.Cat,
          age: 10,
          insurancePolicy: undefined,
          description: undefined
        },
        {
          name: 'animal2',
          species: Species.Dog,
          age: 2,
          insurancePolicy: undefined,
          description: undefined
        }
      ];
      data.forEach(async (pet) => {
        const res = await PetServices.addPet(pet);
        context.petsIds.push(res.lastInsertId);
      });
    })
  },
  afterAll(context: PetSuiteContext) {
  // No need to remove data from DB since it's flushed at the start of each TestSuite
  // Just stop the app server
    return context.appServer.stop();
  },
  beforeEach() {
    // Do nothing
  },
  afterEach() {
    // Do nothing
  },
});


test(updatePetSuite, "should return 400 status code if species is missing", async (context: PetSuiteContext) => {
  const validationTest = context.testFactory.buildBodyValidationTest({paramId: 1});
  await validationTest({age: 1, name: 'Doggy'}, 'species: Invalid species');
});

test(updatePetSuite, "should return 400 status code if species is invalid", async (context: PetSuiteContext) => {
  const validationTest = context.testFactory.buildBodyValidationTest({paramId: 1});
  await validationTest({age: 1, name: 'Doggy', species: 'unknown/invalid'}, 'species: Invalid species');
});

test(updatePetSuite, "should return 400 status code if name is too short", async (context: PetSuiteContext) => {
  const validationTest = context.testFactory.buildBodyValidationTest({paramId: 1});
  await validationTest({age: 1, name: 'aa', species: 'dog'}, 'name: Expect length to be between 3 and 40 characters (actual: 2)');
});

test(updatePetSuite, "should return 400 status code if name is too long", async (context: PetSuiteContext) => {
  const validationTest = context.testFactory.buildBodyValidationTest({paramId: 1});
  await validationTest({age: 1, name: 'a'.repeat(41), species: 'dog'}, 'name: Expect length to be between 3 and 40 characters (actual: 41)');
});

test(updatePetSuite, "should return 400 status code if age is less than 0", async (context: PetSuiteContext) => {
  const validationTest = context.testFactory.buildBodyValidationTest({paramId: 1});
  await validationTest({age: -1, species: 'dog'}, 'age: Expect value to be greater than 0 (actual: -1)');
});

test(updatePetSuite, "should return 400 status code if insurancePolicy not complies to format", async (context: PetSuiteContext) => {
  const validationTest = context.testFactory.buildBodyValidationTest({paramId: 1});
  await validationTest({age: 12, species: 'dog', insurancePolicy: 'a333'}, 'insurancePolicy: Invalid string format (expected: /^[a-z0-9]{10,64}$/)');
});


test(updatePetSuite, "should return 404 not found if resource doesn't exist", async (context: PetSuiteContext) => {
  const url = `${context.endpointUrl}/999`;
  const res = await fetch(url, {
    method: context.method, 
    headers: context.headers,
    body: JSON.stringify({
      name: '  test-dog  ',
      age: 15,
      species: Species.Dog
    }),
  });
  const resBody = await res.text();
  assertEquals(res.status, 404);
  assertEquals(resBody, 'Not found');
});

test(updatePetSuite, "should return 200 and modify only one resource", async (context: PetSuiteContext) => {
  const url = `${context.endpointUrl}/2`;
  const res = await fetch(url, {
    method: context.method, 
    headers: context.headers,
    body: JSON.stringify({
      name: '  test-dog  ',
      age: 15,
      species: Species.Dog
    }),
  });
  const resBody = await res.json();
  assertEquals(res.status, 200);
  assertEquals(resBody.affectedRows, 1);
});

test(updatePetSuite, "should had updated the resource", async () => {
  const pet = await PetServices.getPet({id: 2});
  assertEquals(pet.id, 2);
  assertEquals(pet.name, 'test-dog');
  assertEquals(pet.age,  15);
});


// PATCH Pet
//////////////////////////////////////////////////////////////////////////////

const patchPetSuite: TestSuite<PetSuiteContext> = new TestSuite({
  name: "Patch Pet endpoint",
  sanitizeOps: false,
  sanitizeResources: false,
  beforeAll(context: PetSuiteContext) {
    console.info = () => {};
    context.petsIds = [];
    context.method = 'PATCH';
    context.endpointUrl = `${API_URL}/pets`;
    context.headers = {
      'Content-Type': 'application/json',
    };
    context.testFactory = new IntegrationTestFactory({
      endpointUrl: context.endpointUrl, 
      headers: context.headers,
      method: context.method
    });
    context.appServer = new AppServer({port: Number(PORT), env: ENV, flushDB: true});
    return context.appServer.run().then(() => {
      const data = [
        {
          name: 'animal1',
          species: Species.Cat,
          age: 10,
          insurancePolicy: undefined,
          description: undefined
        },
        {
          name: 'animal2',
          species: Species.Mice,
          age: 2,
          insurancePolicy: undefined,
          description: undefined
        }
      ];
      data.forEach(async (pet) => {
        const res = await PetServices.addPet(pet);
        context.petsIds.push(res.lastInsertId);
      });
    })
  },
  afterAll(context: PetSuiteContext) {
  // No need to remove data from DB since it's flushed at the start of each TestSuite
  // Just stop the app server
    return context.appServer.stop();
  },
  beforeEach() {
    // Do nothing
  },
  afterEach() {
    // Do nothing
  },
});

test(patchPetSuite, "should return 400 status code if species is invalid", async (context: PetSuiteContext) => {
  const validationTest = context.testFactory.buildBodyValidationTest({paramId: 1});
  await validationTest({age: 1, name: 'Doggy', species: 'unknown/invalid'}, 'species: Invalid species');
});

test(patchPetSuite, "should return 400 status code if name is too short", async (context: PetSuiteContext) => {
  const validationTest = context.testFactory.buildBodyValidationTest({paramId: 1});
  await validationTest({age: 1, name: 'aa', species: 'dog'}, 'name: Expect length to be between 3 and 40 characters (actual: 2)');
});

test(patchPetSuite, "should return 400 status code if name is too long", async (context: PetSuiteContext) => {
  const validationTest = context.testFactory.buildBodyValidationTest({paramId: 1});
  await validationTest({age: 1, name: 'a'.repeat(41), species: 'dog'}, 'name: Expect length to be between 3 and 40 characters (actual: 41)');
});

test(patchPetSuite, "should return 400 status code if age is less than 0", async (context: PetSuiteContext) => {
  const validationTest = context.testFactory.buildBodyValidationTest({paramId: 1});
  await validationTest({age: -1, species: 'dog'}, 'age: Expect value to be greater than 0 (actual: -1)');
});

test(patchPetSuite, "should return 400 status code if insurancePolicy not complies to format", async (context: PetSuiteContext) => {
  const validationTest = context.testFactory.buildBodyValidationTest({paramId: 1});
  await validationTest({age: 12, species: 'dog', insurancePolicy: 'a333'}, 'insurancePolicy: Invalid string format (expected: /^[a-z0-9]{10,64}$/)');
});


test(patchPetSuite, "should return 404 not found if resource doesn't exist", async (context: PetSuiteContext) => {
  const url = `${context.endpointUrl}/999`;
  const res = await fetch(url, {
    method: context.method, 
    headers: context.headers,
    body: JSON.stringify({
      name: '  test-dog  ',
    }),
  });
  const resBody = await res.text();
  assertEquals(res.status, 404);
  assertEquals(resBody, 'Not found');
});

test(patchPetSuite, "should return 200 and update one resource", async (context: PetSuiteContext) => {
  const url = `${context.endpointUrl}/2`;
  const res = await fetch(url, {
    method: context.method, 
    headers: context.headers,
    body: JSON.stringify({
      name: '  test-mice  ',
    }),
  });
  const resBody = await res.json();
  assertEquals(res.status, 200);
  assertEquals(resBody.affectedRows, 1);
});

test(patchPetSuite, "should had updated only one field of the resource", async () => {
  const pet = await PetServices.getPet({id: 2});
  assertEquals(pet.id, 2);
  assertEquals(pet.name, 'test-mice');
  assertEquals(pet.age,  2);
  assertEquals(pet.species,  "mice");
});



// DELETE Pet
//////////////////////////////////////////////////////////////////////////////

const deletePetSuite: TestSuite<PetSuiteContext> = new TestSuite({
  name: "Delete Pet endpoint",
  sanitizeOps: false,
  sanitizeResources: false,
  beforeAll(context: PetSuiteContext) {
    console.info = () => {};
    context.petsIds = [];
    context.method = 'DELETE';
    context.endpointUrl = `${API_URL}/pets`;
    context.headers = {
      'Content-Type': 'application/json',
    };
    context.testFactory = new IntegrationTestFactory({
      endpointUrl: context.endpointUrl, 
      headers: context.headers,
      method: context.method
    });
    context.appServer = new AppServer({port: Number(PORT), env: ENV, flushDB: true});
    return context.appServer.run().then(() => {
      const data = [
        {
          name: 'animal1',
          species: Species.Cat,
          age: 10,
          insurancePolicy: undefined,
          description: undefined
        },
        {
          name: 'animal2',
          species: Species.Mice,
          age: 2,
          insurancePolicy: undefined,
          description: undefined
        }
      ];
      data.forEach(async (pet) => {
        const res = await PetServices.addPet(pet);
        context.petsIds.push(res.lastInsertId);
      });
    })
  },
  afterAll(context: PetSuiteContext) {
  // No need to remove data from DB since it's flushed at the start of each TestSuite
  // Just stop the app server
    return context.appServer.stop();
  },
  beforeEach() {
    // Do nothing
  },
  afterEach() {
    // Do nothing
  },
});

test(deletePetSuite, "should return 404 not found if resource doesn't exist", async (context: PetSuiteContext) => {
  const url = `${context.endpointUrl}/999`;
  const res = await fetch(url, {
    method: context.method, 
    headers: context.headers,
  });
  const resBody = await res.text();
  assertEquals(res.status, 404);
  assertEquals(resBody, 'Not found');
});

test(deletePetSuite, "should return 200 and delete one resource", async (context: PetSuiteContext) => {
  const url = `${context.endpointUrl}/2`;
  const res = await fetch(url, {
    method: context.method, 
    headers: context.headers,
  });
  const resBody = await res.json();
  assertEquals(res.status, 200);
  assertEquals(resBody.affectedRows, 1);
});

test(deletePetSuite, "should had deleted the resource", async () => {
  try {
    await PetServices.getPet({id: 2});
    throw 'Not deleted'
  } catch(e) {
    assertEquals(e, { code: "notFound" });
  }
});
