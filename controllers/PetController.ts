import { Request, Response } from "../deps.ts";
import { Controller, CreatedResponse, UpdatedResponse } from "./Controller.ts";
import { PetService } from "../services/PetService.ts";
import { PetSchema, Pet } from "../models/Pet.ts";
import { ValidatorFactory } from "../utils/ValidatorFactory.ts";

export abstract class PetController {
  static className = "petController";

  static async addPet(request: Request, response: Response<CreatedResponse>) {
    await Controller.handleRequest(
      request,
      response,
      PetService.addPet,
      Pet.validator,
    );
  }

  static async getPet(request: Request, response: Response<PetSchema>) {
    await Controller.handleRequest(
      request,
      response,
      PetService.getPet,
      ValidatorFactory.buildGetValidator(),
    );
  }

  static async listPet(request: Request, response: Response<PetSchema[]>) {
    await Controller.handleRequest(
      request,
      response,
      PetService.listPet,
      ValidatorFactory.buildListValidator(),
    );
  }

  static async putPet(request: Request, response: Response<UpdatedResponse>) {
    await Controller.handleRequest(
      request,
      response,
      PetService.updatePet,
      ValidatorFactory.buildUpdateValidator(Pet),
    );
  }

  static async patchPet(request: Request, response: Response<UpdatedResponse>) {
    await Controller.handleRequest(
      request,
      response,
      PetService.updatePet,
      ValidatorFactory.buildPatchValidator(Pet),
    );
  }

  static async deletePet(request: Request, response: Response<UpdatedResponse>) {
    await Controller.handleRequest(
      request,
      response,
      PetService.deletePet,
      ValidatorFactory.buildDeleteValidator(),
    );
  }

}
