import {
  addPet,
  deletePet,
  getPet,
  listPet,
  updatePet,
} from "./pet.services.ts";
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
import { Pet } from "./pet.model.ts";

export const PetRouter = {
  /**
   * Returns the router path
   * @param basePath 
   * @returns 
   */
  getPath: (basePath: string) => {
    return pathJoin(basePath, "pets");
  },
  /**
   * Returns its router
   */
  getRouter: () => {
    return getRouter([{
      method: "post",
      path: "/",
      validation: [getBodyValidation(Pet.schema)],
      controller: getController(addPet, 201),
    }, {
      method: "get",
      path: "/:id",
      validation: [getParamsValidation(getSchema)],
      controller: getController(getPet),
    }, {
      method: "get",
      path: "/",
      validation: [getQueryValidation(listSchema)],
      controller: getController(listPet),
    }, {
      method: "put",
      path: "/:id",
      validation: [
        getParamsValidation(getSchema),
        getBodyValidation(Pet.schema),
      ],
      controller: getController(updatePet),
    }, {
      method: "patch",
      path: "/:id",
      validation: [
        getParamsValidation(getSchema),
        getBodyValidation(convertAllSchemaItemsToOptional(Pet.schema)),
      ],
      controller: getController(updatePet),
    }, {
      method: "delete",
      path: "/:id",
      validation: [getParamsValidation(getSchema)],
      controller: getController(deletePet),
    }]);
  },
};
