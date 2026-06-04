import commonjs from "@rollup/plugin-commonjs";
import { nodeResolve } from "@rollup/plugin-node-resolve";

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
  {
    input: "testValidateEvent.js",
    plugins: [
      nodeResolve({
        preferBuiltins: false,
        browser: true,
      }),
      commonjs(),
    ],
    output: {
      file: "dist/k6-event-validator.bundle.js",
      format: "es",
    },
    external: ["k6", "k6/http"],
  },
];
