import typescript from "rollup-plugin-typescript2";
import copy from 'rollup-plugin-copy';

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
  plugins: [typescript(),
    copy({
      targets: [
        { src: "./src/macro.njk", dest: "./build/" },
        { src: "./src/template.njk", dest: "./build/" },
        { src: "./build/cjs/language-param-setter.d.ts", dest: "./build/cjs/", rename: "language-param-setter.d.cts" }
      ],
      hook: "closeBundle"
    }),
  ],
};
