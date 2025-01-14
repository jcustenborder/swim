import * as FS from "fs";
import nodeResolve from "@rollup/plugin-node-resolve";
import sourcemaps from "rollup-plugin-sourcemaps";
import {terser} from "rollup-plugin-terser";

const script = "swim-build";

const external = [
  "@microsoft/api-extractor",
  "@swim/util",
  "@swim/codec",
  "@swim/component",
  "@swim/sys",
  "@swim/args",
  "@swim/unit",
  "@swim/build",
  "child_process",
  "chokidar",
  "eslint",
  "fs",
  "path",
  "rollup",
  "typescript",
];

const beautify = terser({
  compress: false,
  mangle: false,
  output: {
    preamble: "#!/usr/bin/env node",
    shebang: true,
    beautify: true,
    comments: false,
    indent_level: 2,
  },
});

function makeExecutable() {
  return {
    name: "make-executable",
    writeBundle(options, bundle) {
      let {mode} = FS.statSync(options.file);
      mode |= 0o111; // executable mode
      FS.chmodSync(options.file, mode);
    },
  };
}

export default {
  input: "../../lib/cli/index.js",
  output: {
    file: `../../dist/${script}-cli.cjs`,
    format: "cjs",
    generatedCode: {
      preset: "es2015",
      constBindings: true,
    },
    sourcemap: true,
    interop: "esModule",
    plugins: [beautify],
  },
  external: external.concat("tslib"),
  plugins: [
    nodeResolve(),
    sourcemaps(),
    makeExecutable(),
  ],
  onwarn(warning, warn) {
    if (warning.code === "CIRCULAR_DEPENDENCY") return;
    warn(warning);
  },
};
