import { Request, Response } from "../deps.ts";
import { Controller } from "./Controller.ts";
import { PetService } from "../services/PetService.ts";
import { Pet } from "../models/Pet.ts";
import { getValidator, listValidator } from "../logic/validators.ts";

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
}
