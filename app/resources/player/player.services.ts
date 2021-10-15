import { Values } from "../../../deps.ts";
import { fetchById, fetchList, create, updateById, deleteById } from "../../utils/denodb-extended/mod.ts";
import { ListParams } from "../../utils/denodb-extended/types.ts";
import { Player, PlayerSchema } from "./player.model.ts";

interface updatePlayerSchema extends PlayerSchema {
  id: number;
}

export function addPlayer(body: PlayerSchema) {
  return create(Player, body as Values);
}

export function getPlayer({ id }: { id: number }) {
  return fetchById(Player, id);
}

export function listPlayer(params: ListParams) {
  return fetchList(Player, params);
}

export function updatePlayer({id, ...body}: updatePlayerSchema ) {
  const values = body as PlayerSchema as Values;
  return updateById(Player, id, values);
}

export function deletePlayer({id}: {id:number}) {
  return deleteById(Player, id);
}
