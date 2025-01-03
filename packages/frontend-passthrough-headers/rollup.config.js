import typescript from "rollup-plugin-typescript2";
import copy from 'rollup-plugin-copy';

export default {
  external: ["forwarded-parse", "pino"],
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
  plugins: [typescript(),
    copy({
      targets: [
        { src: "./build/cjs/index.d.ts", dest: "./build/cjs/", rename: "index.d.cts" }
      ],
      hook: "closeBundle"
    }),
  ],
};
