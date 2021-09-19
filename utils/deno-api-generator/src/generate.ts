import { lowerFirst, path, upperFirst } from "./deps.ts";
// 
// Deno script to call from command line for the generation of controllers, 
// services and models from templates.
//
const componentType = Deno.args[0];
const name = Deno.args[1];
const pathToFolder = Deno.args[2];
const fileName = `${upperFirst(name)}${componentType !== 'model' ? upperFirst(componentType) : ''}`;

console.info(`Creating ${componentType} named ${fileName} into folder ${pathToFolder}`);

switch(componentType) {
  case 'controller':
    generateController(name, pathToFolder);
    break;
  case 'model':
    generateModel(name, pathToFolder);
    break;
  case 'service':
    generateService(name, pathToFolder);
    break;
  default:
    console.error('The component you\'re requesting to create is not supported');
}


async function generateController(name: string, pathToFolder: string) {
  const capitalizedName = upperFirst(name);
  const templatesDir = getTemplateDir();
  let controllerTemplate = await Deno.readTextFile(`${templatesDir}/controller-template.txt`);
  controllerTemplate = controllerTemplate.replaceAll('${capitalizedName}', capitalizedName);
  controllerTemplate = controllerTemplate.replaceAll('${name}', lowerFirst(name));
  await Deno.writeTextFile(`${pathToFolder}/${capitalizedName}Controller.ts`, controllerTemplate);
}

async function generateService(name: string, pathToFolder: string) {
  const capitalizedName = upperFirst(name);
  const templatesDir = getTemplateDir();
  let serviceTemplate = await Deno.readTextFile(`${templatesDir}/service-template.txt`);
  serviceTemplate = serviceTemplate.replaceAll('${capitalizedName}', capitalizedName);
  serviceTemplate = serviceTemplate.replaceAll('${name}', lowerFirst(name));
  await Deno.writeTextFile(`${pathToFolder}/${capitalizedName}Service.ts`, serviceTemplate);
}

async function generateModel(name: string, pathToFolder: string) {
  const capitalizedName = upperFirst(name);
  const templatesDir = getTemplateDir();
  let modelTemplate = await Deno.readTextFile(`${templatesDir}/model-template.txt`);
  modelTemplate = modelTemplate.replaceAll('${capitalizedName}', capitalizedName);
  modelTemplate = modelTemplate.replaceAll('${name}', lowerFirst(name));
  await Deno.writeTextFile(`${pathToFolder}/${capitalizedName}.ts`, modelTemplate);
}

function getTemplateDir() {
  return path.dirname(path.fromFileUrl(import.meta.url)) + '/../templates';
}