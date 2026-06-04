import typescript from "rollup-plugin-typescript2";
import copy from "rollup-plugin-copy";

export default {
  external: ["pino", "ajv/dist/2019", "@aws-sdk/client-sqs", "@govuk-one-login/event-catalogue", "@govuk-one-login/event-catalogue-schemas"],
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
      tsconfig: "tsconfig.build.json"
    }),
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
