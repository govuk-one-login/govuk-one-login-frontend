import typescript from "rollup-plugin-typescript2";
import copy from "rollup-plugin-copy";
import CleanCSS from "clean-css";

export default {
  input: "./src/language-param-setter.ts",
  output: [
    {
      file: "build/cjs/language-param-setter.cjs",
      format: "cjs",
    },
    {
      file: "build/esm/language-param-setter.js",
      format: "es",
    },
  ],
  plugins: [
    typescript(),
    copy({
      targets: [
        {
          src: "./src/stylesheet/styles.css",
          dest: "./build/stylesheet/",
          transform: (contents) => new CleanCSS().minify(contents).styles,
        },
        { src: "./src/macro.njk", dest: "./build" },
        { src: "./src/template.njk", dest: "./build" },
        { src: "./src/language-select.yaml", dest: "./build" },
      ],
      hook: "closeBundle"
    }),
  ],
};
