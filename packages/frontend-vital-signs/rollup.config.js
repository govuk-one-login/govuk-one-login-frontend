import json from "@rollup/plugin-json";
import typescript from "rollup-plugin-typescript2";
import copy from 'rollup-plugin-copy';

export default {
  external: ["pino"],
  input: "src/index.ts",
  output: [
    {
      file: "cjs/index.cjs",
      format: "cjs",
    },
    {
      file: "esm/index.js",
      format: "es",
    },
  ],
  plugins: [
    typescript(),
    json(),
    copy({
      targets: [
        { src: "./cjs/index.d.ts", dest: "./cjs/", rename: "index.d.cts" }
      ],
      hook: "closeBundle"
    }),
  ],
};
