// import { controllers } from '../controllers/mod.ts';

// controllers.forEach((ctrl) => {
//   ctrl.className
// });

export async function runRouter() {
  const schema = await loadApiSchema();
}

async function loadApiSchema() {
  const schemaPath = "/Users/daniel/Project/my-deno-api-test/api/openapi.json";
  const data = await Deno.readFile(schemaPath);
  const strSchema = new TextDecoder().decode(data);
  return JSON.parse(strSchema);
}
