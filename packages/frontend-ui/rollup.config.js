import json from "@rollup/plugin-json";
import copy from "rollup-plugin-copy";
import scss from "rollup-plugin-scss";
import typescript from "rollup-plugin-typescript2";

function onwarn(warning, warn) {
  // Suppress empty chunk warnings for SCSS-only builds
  if (
    warning.code === "EMPTY_BUNDLE" ||
    warning.message.includes("Generated an empty chunk") ||
    warning.message.includes("Deprecation Warning")
  ) {
    return;
  }
  warn(warning);
}



export default [
  // Main library build
  {
    external: ["pino"],
    input: "src/index.ts",
    output: [
      {
        file: "build/cjs/backend/index.cjs",
        format: "cjs",
      },
      {
        file: "build/esm/backend/index.js",
        format: "es",
      },
    ],
    plugins: [
      typescript(),
      copy({
        targets: [
          {
            src: "./build/cjs/backend/index.d.ts",
            dest: "./build/cjs/backend/",
            rename: "index.d.cts",
          },
          { src: "./components/", dest: "./build/" },
        ],
        hook: "closeBundle",
      }),
      json(),
    ],
  },
  // Frontend UI build
  {
    input: "frontend-src/index.ts",
    output: [
      {
        file: "build/cjs/frontend/index.cjs",
        format: "cjs",
      },
      {
        file: "build/esm/frontend/index.js",
        format: "es",
      },
    ],
    plugins: [
      typescript({
        tsconfig: "frontend-src/tsconfig.json",
      }),
      copy({
        targets: [
          {
            src: "./build/cjs/frontend/index.d.ts",
            dest: "./build/cjs/frontend/",
            rename: "index.d.cts",
          }
        ],
        hook: "closeBundle",
      }),
    ],
  },
  // SCSS build for components
  {
    input: "./src/all.scss",
    output: { file: "build/all.css" },
    plugins: [scss({ fileName: "all.css", outputStyle: "compressed" })],
    onwarn,
  },
];
