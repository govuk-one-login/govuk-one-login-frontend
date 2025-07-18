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
  // Main library build
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
          { src: "./components/", dest: "./build/" },
          {
      src: "./browser-tests/visual/visual-tests.spec.ts-snapshots/*",
      dest: "./browser-tests/visual/visual-tests.spec.ts-snapshots",
      rename: (name, extension) => {
        // Replace 'darwin' with 'linux' in the filename
        const newName = name.replace(/darwin/g, "linux");
        return `${newName}${extension ? '.' + extension : ''}`;
      },
    },
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
        file: "build/cjs/index-fe.cjs",
        format: "cjs",
      },
      {
        file: "build/esm/index-fe.js",
        format: "es",
      },
    ],
    plugins: [
      typescript({
        tsconfig: "frontend-src/tsconfig.json",
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
