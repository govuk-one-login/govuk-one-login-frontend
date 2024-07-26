import typescript from "rollup-plugin-typescript2";

export default {
  input: "language-param-setter.ts",
  output: [
    {
      file: "build/cjs/language-param-setter.cjs",
      format: "cjs",
    },
    {
      file: "build/esm/language-param-setter.js",
      format: "es",
    },
  ],
  plugins: [typescript()],
};
