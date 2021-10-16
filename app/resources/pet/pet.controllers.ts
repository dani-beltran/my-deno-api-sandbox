import { Request, Response } from "../../../deps.ts";
import { Controller } from "../../utils/deno-api/controller.ts";
import  * as petServices from "./pet.services.ts";
import { PetSchema, Pet } from "./pet.model.ts";
import { ValidatorFactory } from "../../utils/deno-api/validator-factory.ts";
import { CreatedResponse, UpdatedResponse } from "../../utils/deno-api/types.ts";

export async function addPetCtrl(req: Request, res: Response<CreatedResponse>) {
  await Controller.passRequestToService(
    req,
    res,
    petServices.addPet,
    Pet.validator,
  );
}

export async function getPetCtrl(req: Request, res: Response<PetSchema>) {
  await Controller.passRequestToService(
    req,
    res,
    petServices.getPet,
    ValidatorFactory.buildGetValidator(),
  );
}

export async function listPetCtrl(req: Request, res: Response<PetSchema[]>) {
  await Controller.passRequestToService(
    req,
    res,
    petServices.listPet,
    ValidatorFactory.buildListValidator(),
  );
}

export async function putPetCtrl(req: Request, res: Response<UpdatedResponse>) {
  await Controller.passRequestToService(
    req,
    res,
    petServices.updatePet,
    ValidatorFactory.buildUpdateValidator(Pet.schema),
  );
}

export async function patchPetCtrl(req: Request, res: Response<UpdatedResponse>) {
  await Controller.passRequestToService(
    req,
    res,
    petServices.updatePet,
    ValidatorFactory.buildPatchValidator(Pet.schema),
  );
}

export async function deletePetCtrl(req: Request, res: Response<UpdatedResponse>) {
  await Controller.passRequestToService(
    req,
    res,
    petServices.deletePet,
    ValidatorFactory.buildDeleteValidator(),
  );
}