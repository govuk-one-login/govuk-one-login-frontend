import json from "@rollup/plugin-json";
import copy from "rollup-plugin-copy";
import scss from "rollup-plugin-scss";
import typescript from "rollup-plugin-typescript2";

export default [
  {
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
      copy({
        targets: [
          { src: "./build/cjs/index.d.ts", dest: "./build/cjs/", rename: "index.d.cts" },
          { src: "./src/macro.njk", dest: "./build" },
          { src: "./src/template.njk", dest: "./build" },
          { src: "./src/header.yaml", dest: "./build" },
          { src: "./components/", dest: "./build/" },
        ],
        hook: "closeBundle",
      }),
      json(),
    ],
  },
  {
    input: "frontend-src/index.js",
    output: [
      {
        file: "build/cjs/index-fe.cjs",
        format: "cjs",
      },
      {
        file: "build/esm/index-fe.js",
        format: "es",
      },
    ],
  },
  {
    input: "./src/all.scss",
    output: {
      file: "build/all.css",
    },
    plugins: [
      scss({
        fileName: "all.css",
        outputStyle: "compressed",
      }),
    ],
  },
];
