import { Request, Response } from '../deps.ts';
import { Controller } from './Controller.ts';
import { PetService } from '../services/PetService.ts';
import { Pet } from "../models/Pet.ts";

export class PetController {
  static className = 'petController';

  static async addPet(request: Request, response: Response<any>) {
     await Controller.handleRequest(request, response, PetService.addPet, Pet.validator);
  }

  static async getPet(request: Request, response: Response<any>) {
     await Controller.handleRequest(request, response, PetService.getPet);
  }

  static async listPet(request: Request, response: Response<any>) {
    await Controller.handleRequest(request, response, PetService.listPet);
 }
}

 