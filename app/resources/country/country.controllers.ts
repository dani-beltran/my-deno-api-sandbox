import { Request, Response } from "../../../deps.ts";
import { Controller } from "../../utils/deno-api/controller.ts";
import  * as countryServices from "./country.services.ts";
import { CountrySchema, Country } from "./country.model.ts";
import { ValidatorFactory } from "../../utils/deno-api/validator-factory.ts";
import { CreatedResponse, UpdatedResponse } from "../../utils/deno-api/types.ts";

export async function addCountryCtrl(req: Request, res: Response<CreatedResponse>) {
  await Controller.passRequestToService(
    req,
    res,
    countryServices.addCountry,
    Country.validator,
  );
}

export async function getCountryCtrl(req: Request, res: Response<CountrySchema>) {
  await Controller.passRequestToService(
    req,
    res,
    countryServices.getCountry,
    ValidatorFactory.buildGetValidator(),
  );
}

export async function listCountryCtrl(req: Request, res: Response<CountrySchema[]>) {
  await Controller.passRequestToService(
    req,
    res,
    countryServices.listCountry,
    ValidatorFactory.buildListValidator(),
  );
}

export async function putCountryCtrl(req: Request, res: Response<UpdatedResponse>) {
  await Controller.passRequestToService(
    req,
    res,
    countryServices.updateCountry,
    ValidatorFactory.buildUpdateValidator(Country),
  );
}

export async function patchCountryCtrl(req: Request, res: Response<UpdatedResponse>) {
  await Controller.passRequestToService(
    req,
    res,
    countryServices.updateCountry,
    ValidatorFactory.buildPatchValidator(Country),
  );
}

export async function deleteCountryCtrl(req: Request, res: Response<UpdatedResponse>) {
  await Controller.passRequestToService(
    req,
    res,
    countryServices.deleteCountry,
    ValidatorFactory.buildDeleteValidator(),
  );
}