import {
  addProjectConfiguration,
  formatFiles,
  generateFiles,
  Tree,
  names,
  readJson,
} from "@nx/devkit";
import * as path from "path";
import { GenerateComponentGeneratorSchema } from "./schema";

export async function generateComponentGenerator(
  tree: Tree,
  options: GenerateComponentGeneratorSchema,
) {
  const scopeName = readJson(tree, "package.json").name;
  const resolvedOptions = {
    ...options,
    name: names(options.name).fileName,
    scope: scopeName,
  };
  const projectRoot = `packages/${resolvedOptions.name}`;
  addProjectConfiguration(tree, options.name, {
    root: projectRoot,
    projectType: "library",
    sourceRoot: `${projectRoot}/src`,
    targets: {},
  });
  generateFiles(
    tree,
    path.join(__dirname, "files"),
    projectRoot,
    resolvedOptions,
  );
  await formatFiles(tree);
}

export default generateComponentGenerator;
