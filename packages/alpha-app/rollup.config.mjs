import { nodeResolve } from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import typescript from "rollup-plugin-typescript2";
import copy from "rollup-plugin-copy";

export default [
  {
    input: "src/app.ts",
    external: ["pino"],
    plugins: [
      commonjs(),
      typescript({ tsconfig: "tsconfig.json" }),
      json(),
      copy({
        targets: [
          {
            src: "./src/assets",
            dest: "./build",
          },
          {
            src: "./src/locales",
            dest: "./build",
          },
          {
            src: "./src/views",
            dest: "./build",
          },
        ],
        hook: "closeBundle",
      }),
    ],
    output: [
      {
        file: "build/app.js",
        format: "es",
        inlineDynamicImports: true,
      },
    ],
  },
  {
    input: "src/frontend-assets/javascript/index.ts",
    plugins: [
      nodeResolve(),
      commonjs(),
      typescript({ tsconfig: "tsconfig-frontend.json" }),
      json(),
    ],
    output: [
      {
        file: "public/javascript/index.js",
        format: "iife",
        inlineDynamicImports: true,
      },
    ],
  },
];
