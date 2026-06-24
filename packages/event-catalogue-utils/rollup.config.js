import json from "@rollup/plugin-json";
import typescript from "rollup-plugin-typescript2";
import copy from "rollup-plugin-copy";

export default {
  external: [
    "@govuk-one-login/event-catalogue",
    "@govuk-one-login/event-catalogue-schemas", 
    "@govuk-one-login/frontend-logger",
    "@aws-sdk/client-sqs",
    "ajv",
    "ajv/dist/2019",
    "lodash"
  ],
  input: "src/index.ts",
  output: [
    {
      file: "build/cjs/index.cjs",
      format: "cjs",
    },
    {
      file: "build/esm/index.js",
      format: "es",
    },
  ],
  plugins: [
    typescript({
      tsconfig: "tsconfig.build.json",
    }),
    json(),
    copy({
      targets: [
        {
          src: "./build/cjs/index.d.ts",
          dest: "./build/cjs/",
          rename: "index.d.cts",
        },
      ],
      hook: "closeBundle",
    }),
  ],
};