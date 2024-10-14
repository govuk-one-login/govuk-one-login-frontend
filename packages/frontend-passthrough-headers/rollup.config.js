import typescript from "rollup-plugin-typescript2";

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
  plugins: [typescript()],
};
