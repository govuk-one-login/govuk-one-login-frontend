import resolve from "@rollup/plugin-node-resolve";
import jsx from "rollup-plugin-jsx";

export default [
  {
    // input: "src/frontend-assets/index.js",
    input: "src/index.js",

    plugins: [
      //nodeResolve(),
      resolve(),
      jsx({
        factory: "h",
        fragment: "Fragment",
        babelConfig: {
          presets: ["@babel/preset-react"],
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
