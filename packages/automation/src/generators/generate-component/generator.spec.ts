import { createTreeWithEmptyWorkspace } from "@nx/devkit/testing";
import { Tree, readProjectConfiguration } from "@nx/devkit";

import { generateComponentGenerator } from "./generator";
import { GenerateComponentGeneratorSchema } from "./schema";

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
