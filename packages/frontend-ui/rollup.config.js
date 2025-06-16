import json from "@rollup/plugin-json";
import copy from "rollup-plugin-copy";
import scss from "rollup-plugin-scss";
import typescript from "rollup-plugin-typescript2";

function onwarn(warning, warn) {
  // Suppress empty chunk warnings for SCSS-only builds
  if (
    warning.code === "EMPTY_BUNDLE" ||
    warning.message.includes("Generated an empty chunk")
  ) {
    return;
  }
  warn(warning);
}

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
          {
            src: "./build/cjs/index.d.ts",
            dest: "./build/cjs/",
            rename: "index.d.cts",
          },
          { src: "./src/macro.njk", dest: "./build" },
          { src: "./src/template.njk", dest: "./build" },
          { src: "./src/header.yaml", dest: "./build" },
          {
            src: "./components/",
            dest: "./build/",
          },
          {
            src: "./frontendUiAssets/",
            dest: "./build/",
          },
        ],
        hook: "closeBundle",
      }),
      json(),
    ],
  },
  {
    plugins: [
      typescript({
        tsconfig: "frontend-src/tsconfig.json",
      }),
    ],
    input: "frontend-src/index.ts",
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
    output: { file: "build/all.css" },
    plugins: [scss({ fileName: "all.css", outputStyle: "compressed" })],
    onwarn,
  },
];
