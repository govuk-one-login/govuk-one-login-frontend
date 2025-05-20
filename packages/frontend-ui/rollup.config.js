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
          {
            src: "./components/",
            dest: "./build/",
          },
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
    input: "./src/all-v4.scss",
    output: {
      file: "build/all-v4.css",
    },
    plugins: [
      scss({
        fileName: "all-v4.css",
        outputStyle: "compressed",
      }),
    ],
  },
  {
    input: "./src/all-v5.scss",
    output: {
      file: "build/all-v5.css",
    },
    plugins: [
      scss({
        fileName: "all-v5.css",
        outputStyle: "compressed",
      }),
      copy({
        targets: [
          {
            src: 'node_modules/govuk-frontend/dist/govuk/assets/images/*',
            dest: 'public/govuk/assets/images',
          },
        ],
      }),
    ],
  },
];
