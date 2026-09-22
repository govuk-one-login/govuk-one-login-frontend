import { readProjectConfiguration, type Tree } from "@nx/devkit";
import { createTreeWithEmptyWorkspace } from "@nx/devkit/testing";

import { generateComponentGenerator } from "./generator";
import type { GenerateComponentGeneratorSchema } from "./schema";

describe("generate-component generator", () => {
  let tree: Tree;
  const options: GenerateComponentGeneratorSchema = {
    name: "test",
    description: "test description",
  };

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace();
  });

  it("should run successfully", async () => {
    await generateComponentGenerator(tree, options);
    const config = readProjectConfiguration(tree, "test");
    expect(config).toBeDefined();
  });
});
