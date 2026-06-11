import { nodeResolve } from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";

export default {
  input: "testValidateEvent.js",
  plugins: [
    nodeResolve({
      preferBuiltins: false,
      browser: true,
    }),
    commonjs(),
  ],
  output: {
    file: "dist/testValidateEvent.bundle.js",
    format: "es",
  },
  external: ["k6", "k6/http"],
};