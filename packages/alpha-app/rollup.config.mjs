import { nodeResolve } from "@rollup/plugin-node-resolve";

export default [
  {
    input: "src/frontend-assets/javascript/index.js",
    plugins: [nodeResolve()],
    output: [
      {
        file: "public/javascript/index.js",
        format: "iife",
      },
    ],
  },
];
