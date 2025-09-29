import presetReact from "@babel/preset-react";
import resolve, { nodeResolve } from "@rollup/plugin-node-resolve";
import jsx from "rollup-plugin-jsx";

export default [
  {
    // input: "src/frontend-assets/index.js",
    input: "src/index.js",

    plugins: [
      nodeResolve(),
      resolve(),
      jsx({
        factory: "h", // Use a simple 'h' function for element creation
        fragment: "Fragment", // Define a Fragment component (optional)
        babelConfig: {
          presets: [presetReact],
          plugins: [
            // Add Babel plugins here if needed
          ],
        },
      }),
    ],
    output: [
      {
        file: "public/javascript/index.js",
        format: "iife",
      },
    ],
  },
];
