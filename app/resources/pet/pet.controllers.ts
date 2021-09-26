import { Request, Response } from "../../deps.ts";
import { Controller } from "../../utils/controller.ts";
import  * as petServices from "./pet.services.ts";
import { PetSchema, Pet } from "./pet.model.ts";
import { ValidatorFactory } from "../../utils/denodb-extended/validator-factory.ts";
import { CreatedResponse, UpdatedResponse } from "../../utils/denodb-extended/types.ts";

export async function addPetCtrl(request: Request, response: Response<CreatedResponse>) {
  await Controller.handleRequest(
    request,
    response,
    petServices.addPet,
    Pet.validator,
  );
}

export async function getPetCtrl(request: Request, response: Response<PetSchema>) {
  await Controller.handleRequest(
    request,
    response,
    petServices.getPet,
    ValidatorFactory.buildGetValidator(),
  );
}

export async function listPetCtrl(request: Request, response: Response<PetSchema[]>) {
  await Controller.handleRequest(
    request,
    response,
    petServices.listPet,
    ValidatorFactory.buildListValidator(),
  );
}

export async function putPetCtrl(request: Request, response: Response<UpdatedResponse>) {
  await Controller.handleRequest(
    request,
    response,
    petServices.updatePet,
    ValidatorFactory.buildUpdateValidator(Pet),
  );
}

export async function patchPetCtrl(request: Request, response: Response<UpdatedResponse>) {
  await Controller.handleRequest(
    request,
    response,
    petServices.updatePet,
    ValidatorFactory.buildPatchValidator(Pet),
  );
}

export async function deletePetCtrl(request: Request, response: Response<UpdatedResponse>) {
  await Controller.handleRequest(
    request,
    response,
    petServices.deletePet,
    ValidatorFactory.buildDeleteValidator(),
  );
}