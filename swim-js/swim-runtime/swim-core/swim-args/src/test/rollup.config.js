import nodeResolve from "@rollup/plugin-node-resolve";
import sourcemaps from "rollup-plugin-sourcemaps";
import {terser} from "rollup-plugin-terser";

const script = "swim-args";

const external = [
  "@swim/util",
  "@swim/codec",
  "@swim/args",
  "@swim/unit",
];

const beautify = terser({
  compress: false,
  mangle: false,
  output: {
    beautify: true,
    comments: false,
    indent_level: 2,
  },
});

export default {
  input: "../../lib/test/index.js",
  output: {
    file: `../../dist/${script}-test.mjs`,
    format: "esm",
    generatedCode: {
      preset: "es2015",
      constBindings: true,
    },
    sourcemap: true,
    plugins: [beautify],
  },
  external: external.concat("tslib"),
  plugins: [
    nodeResolve(),
    sourcemaps(),
  ],
  onwarn(warning, warn) {
    if (warning.code === "CIRCULAR_DEPENDENCY") return;
    warn(warning);
  },
};
