import { defineConfig } from "tsup";

export default defineConfig({
    entry: ["src/**/*.ts"],
    format: ["cjs", "esm"],
    tsconfig: "tsconfig.json",
    target: "ES6",
    dts: true,
    splitting: false,
    clean: true,
});
