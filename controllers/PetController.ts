/**
 * The PetController file is a very simple one, which does not need to be changed manually,
 * unless there's a case where business logic reoutes the request to an entity which is not
 * the service.
 * The heavy lifting of the Controller item is done in Request.js - that is where request
 * parameters are extracted and sent to the service, and where response is handled.
 */

import { Request, Response } from '../deps.ts';
import { Controller } from './Controller.ts';
import { PetService } from '../services/PetService.ts';

//  const Controller = require('./Controller');
//  const service = require('../services/PetService');

export class PetController {
  static className = 'petController';

  static async addPet(request: Request, response: Response<any>) {
     await Controller.handleRequest(request, response, PetService.addPet);
  }

  static async getPet(request: Request, response: Response<any>) {
     await Controller.handleRequest(request, response, PetService.getPet);
  }

  static async listPet(request: Request, response: Response<any>) {
    await Controller.handleRequest(request, response, PetService.listPet);
 }
}

 