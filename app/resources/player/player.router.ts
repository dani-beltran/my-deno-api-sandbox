import {
  addPlayer,
  deletePlayer,
  getPlayer,
  listPlayer,
  updatePlayer,
} from "./player.services.ts";
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
import { Player } from "./player.model.ts";
import { IApiRouter } from "../../utils/deno-api/types.ts";

export const PlayerRouter: IApiRouter = {
  /**
   * Returns the router path
   * @param basePath 
   * @returns 
   */
  getPath: (basePath: string) => {
    return pathJoin(basePath, "players");
  },
  /**
   * Returns its router
   */
  getRouter: () => {
    return getRouter([{
      method: "post",
      path: "/",
      validation: [getBodyValidation(Player.schema)],
      controller: getController(addPlayer, 201),
    }, {
      method: "get",
      path: "/:id",
      validation: [getParamsValidation(getSchema)],
      controller: getController(getPlayer),
    }, {
      method: "get",
      path: "/",
      validation: [getQueryValidation(listSchema)],
      controller: getController(listPlayer),
    }, {
      method: "put",
      path: "/:id",
      validation: [
        getParamsValidation(getSchema),
        getBodyValidation(Player.schema),
      ],
      controller: getController(updatePlayer),
    }, {
      method: "patch",
      path: "/:id",
      validation: [
        getParamsValidation(getSchema),
        getBodyValidation(convertAllSchemaItemsToOptional(Player.schema)),
      ],
      controller: getController(updatePlayer),
    }, {
      method: "delete",
      path: "/:id",
      validation: [getParamsValidation(getSchema)],
      controller: getController(deletePlayer),
    }]);
  },
};
