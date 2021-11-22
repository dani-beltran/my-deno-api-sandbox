import {
  addCountry,
  deleteCountry,
  getCountry,
  listCountry,
  updateCountry,
} from "./country.services.ts";
import {
  convertAllSchemaItemsToOptional,
  getBodyValidation,
  getController,
  getParamsValidation,
  getQueryValidation,
  getRouter,
} from "../../utils/deno-api/api-methods.ts";
import {
  getSchema,
  listSchema,
} from "../../utils/deno-api/schema-definitions.ts";
import { pathJoin } from "../../../deps.ts";
import { Country } from "./country.model.ts";
import { IApiRouter } from "../../utils/deno-api/types.ts";

export const CountryRouter: IApiRouter = {
  /**
   * Returns the router path
   * @param basePath 
   * @returns 
   */
  getPath: (basePath: string) => {
    return pathJoin(basePath, "countries");
  },
  /**
   * Returns its router
   */
  getRouter: () => {
    return getRouter([{
      method: "post",
      path: "/",
      validation: [getBodyValidation(Country.schema)],
      controller: getController(addCountry, 201),
    }, {
      method: "get",
      path: "/:id",
      validation: [getParamsValidation(getSchema)],
      controller: getController(getCountry),
    }, {
      method: "get",
      path: "/",
      validation: [getQueryValidation(listSchema)],
      controller: getController(listCountry),
    }, {
      method: "put",
      path: "/:id",
      validation: [
        getParamsValidation(getSchema),
        getBodyValidation(Country.schema),
      ],
      controller: getController(updateCountry),
    }, {
      method: "patch",
      path: "/:id",
      validation: [
        getParamsValidation(getSchema),
        getBodyValidation(convertAllSchemaItemsToOptional(Country.schema)),
      ],
      controller: getController(updateCountry),
    }, {
      method: "delete",
      path: "/:id",
      validation: [getParamsValidation(getSchema)],
      controller: getController(deleteCountry),
    }]);
  },
};
