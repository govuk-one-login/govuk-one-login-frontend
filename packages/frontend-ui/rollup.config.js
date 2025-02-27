import typescript from "rollup-plugin-typescript2";
import copy from "rollup-plugin-copy";
import json from '@rollup/plugin-json';
import scss from 'rollup-plugin-scss';

export default [{
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
        { src: "./src/macro.njk", dest: "./build" },
        { src: "./src/template.njk", dest: "./build" },
        {
          src: "./components/",
          dest: "./build/",
        },

        
      ],
      hook: "closeBundle",
    }),
    json()
  ],
},
{
  input: "./src/all.scss",
  output:
    {
      file: "build/all.css",
    },
  plugins: [
    scss({ fileName: 'all.css'}),
  ]
}
];
