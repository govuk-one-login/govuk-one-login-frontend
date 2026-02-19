import path from "path";
import { fileURLToPath } from "url";
import typescript from "rollup-plugin-typescript2";
import terser from "@rollup/plugin-terser";
import copy from "rollup-plugin-copy";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default {
  input: "./src/index.ts",
  output: {
    file: path.resolve(dirname, "lib/analytics.js"),
    format: "iife",
    name: "Analytics",
    sourcemap: false,
  },
  plugins: [
    resolve(),
    commonjs(),
    typescript(),
    terser({
      format: {
        preamble:
          "/* eslint-disable no-console,no-useless-escape, no-unused-vars */",
        comments: false,
      },
    }),
    copy({
      targets: [
        { src: "./src/components", dest: "." }, // Copies to ./components
      ],
    }),
  ],
};
