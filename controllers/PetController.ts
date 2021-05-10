import { Request, Response } from "../deps.ts";
import { Controller } from "./Controller.ts";
import { PetService } from "../services/PetService.ts";
import { Pet } from "../models/Pet.ts";
import { getUpdateValidator, getValidator, listValidator } from "../logic/validators.ts";

export class PetController {
  static className = "petController";

  static async addPet(request: Request, response: Response<any>) {
    await Controller.handleRequest(
      request,
      response,
      PetService.addPet,
      Pet.validator,
    );
  }

  static async getPet(request: Request, response: Response<any>) {
    await Controller.handleRequest(
      request,
      response,
      PetService.getPet,
      getValidator,
    );
  }

  static async listPet(request: Request, response: Response<any>) {
    await Controller.handleRequest(
      request,
      response,
      PetService.listPet,
      listValidator,
    );
  }

  static async putPet(request: Request, response: Response<any>) {
    await Controller.handleRequest(
      request,
      response,
      PetService.updatePet,
      getUpdateValidator(Pet),
    );
  }

  // static async patchPet(request: Request, response: Response<any>) {
  //   await Controller.handleRequest(
  //     request,
  //     response,
  //     PetService.updatePet,
  //     Pet.validator,
  //   );
  // }

  // static async deletePet(request: Request, response: Response<any>) {
  //   await Controller.handleRequest(
  //     request,
  //     response,
  //     PetService.deletePet,
  //     deleteValidator,
  //   );
  // }

}
