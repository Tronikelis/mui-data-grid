/* eslint-disable import/no-anonymous-default-export */
import typescript from "@rollup/plugin-typescript";
import dts from "rollup-plugin-dts";
import externals from "rollup-plugin-node-externals";
import { terser } from "rollup-plugin-terser";

import pkg from "./package.json";

export default [
    {
        input: "./src/index.ts",
        output: {
            file: pkg.main,
            format: "esm",
        },
        plugins: [
            typescript({
                target: "ES2019",
                jsx: "react-jsx",
            }),
            externals({
                packagePath: "./package.json",
                deps: true,
                peerDeps: true,
                optDeps: true,
                devDeps: true,
            }),
            terser(),
        ],
    },
    {
        input: "./src/typings.d.ts",
        output: {
            file: pkg.types,
        },
        plugins: [dts()],
    },
];
