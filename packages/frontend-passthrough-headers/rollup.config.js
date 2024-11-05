import typescript from "rollup-plugin-typescript2";
import copy from 'rollup-plugin-copy';

export default {
  external: ["forwarded-parse", "pino"],
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
  plugins: [typescript(),
    copy({
      targets: [
        { src: "./cjs/index.d.ts", dest: "./cjs/", rename: "index.d.cts" }
      ],
      hook: "closeBundle"
    }),
  ],
};
