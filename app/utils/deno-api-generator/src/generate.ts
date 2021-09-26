import { lowerFirst, path, upperFirst } from "./deps.ts";
// 
// Deno script to call from command line for the generation of controllers, 
// services and models from templates.
//
const componentType = Deno.args[0];
const name = Deno.args[1];
const pathToFolder = Deno.args[2];
const fileName = getFilename(name);
generate(componentType, name, pathToFolder);
console.info(`Created ${componentType} named ${fileName} into folder ${pathToFolder}`);

async function generate(componentType: string, name: string, pathToFolder: string) {
  if (!isValidComponentType(componentType)) {
    console.error('The component you\'re requesting to create is not supported');
    return;
  }
  const capitalizedName = upperFirst(name);
  const templatesDir = getTemplateDir();
  let template = await Deno.readTextFile(`${templatesDir}/${componentType}-template.txt`);
  template = template.replaceAll('{{capitalizedName}}', capitalizedName);
  template = template.replaceAll('{{name}}', lowerFirst(name));
  await Deno.writeTextFile(`${pathToFolder}/${getFilename(name)}.ts`, template);
}

function isValidComponentType(value: string) {
  const validValues = [
    'controller',
    'model',
    'service',
    'router'
  ];
  return validValues.indexOf(value) !== -1;
}

function getFilename(resourceName: string) {
  let name = `${resourceName.toLowerCase()}.${componentType}`;
  if (componentType === 'controller' || componentType === 'service') {
    name += 's';
  }
  return name;
}

function getTemplateDir() {
  return path.dirname(path.fromFileUrl(import.meta.url)) + '/../templates';
}