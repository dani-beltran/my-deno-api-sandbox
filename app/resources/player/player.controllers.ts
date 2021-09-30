import { Request, Response } from "../../deps.ts";
import { Controller } from "../../utils/deno-api/controller.ts";
import  * as playerServices from "./player.services.ts";
import { PlayerSchema, Player } from "./player.model.ts";
import { ValidatorFactory } from "../../utils/denodb-extended/validator-factory.ts";
import { CreatedResponse, UpdatedResponse } from "../../utils/denodb-extended/types.ts";

export async function addPlayerCtrl(req: Request, res: Response<CreatedResponse>) {
  await Controller.passRequestToService(
    req,
    res,
    playerServices.addPlayer,
    Player.validator,
  );
}

export async function getPlayerCtrl(req: Request, res: Response<PlayerSchema>) {
  await Controller.passRequestToService(
    req,
    res,
    playerServices.getPlayer,
    ValidatorFactory.buildGetValidator(),
  );
}

export async function listPlayerCtrl(req: Request, res: Response<PlayerSchema[]>) {
  await Controller.passRequestToService(
    req,
    res,
    playerServices.listPlayer,
    ValidatorFactory.buildListValidator(),
  );
}

export async function putPlayerCtrl(req: Request, res: Response<UpdatedResponse>) {
  await Controller.passRequestToService(
    req,
    res,
    playerServices.updatePlayer,
    ValidatorFactory.buildUpdateValidator(Player),
  );
}

export async function patchPlayerCtrl(req: Request, res: Response<UpdatedResponse>) {
  await Controller.passRequestToService(
    req,
    res,
    playerServices.updatePlayer,
    ValidatorFactory.buildPatchValidator(Player),
  );
}

export async function deletePlayerCtrl(req: Request, res: Response<UpdatedResponse>) {
  await Controller.passRequestToService(
    req,
    res,
    playerServices.deletePlayer,
    ValidatorFactory.buildDeleteValidator(),
  );
}