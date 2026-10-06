import path from "node:path";
import { fileURLToPath } from "node:url";
import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import replace from "@rollup/plugin-replace";
import terser from "@rollup/plugin-terser";
import copy from "rollup-plugin-copy";
import typescript from "rollup-plugin-typescript2";

import packageJson from "./package.json" with { type: "json" };

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
    replace({
      preventAssignment: true,
      __PACKAGE_VERSION__: packageJson.version,
    }),
    copy({
      targets: [
        { src: "./src/components", dest: "." }, // Copies to ./components
      ],
    }),
  ],
};
