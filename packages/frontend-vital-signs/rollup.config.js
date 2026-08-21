import json from "@rollup/plugin-json";
import copy from "rollup-plugin-copy";
import typescript from "rollup-plugin-typescript2";

export default {
  external: ["pino"],
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
    typescript(),
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
