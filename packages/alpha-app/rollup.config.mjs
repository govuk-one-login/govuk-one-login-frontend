import { nodeResolve } from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";

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