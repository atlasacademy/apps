import babelParser from "@babel/eslint-parser";
import js from "@eslint/js";
import reactHooks from "eslint-plugin-react-hooks";
import globals from "globals";

export default [
    { ignores: ["build/**", "node_modules/**"] },
    {
        files: ["src/**/*.{ts,tsx}"],
        languageOptions: {
            parser: babelParser,
            globals: { ...globals.browser, ...globals.es2025 },
            parserOptions: {
                requireConfigFile: false,
                babelOptions: {
                    presets: ["@babel/preset-typescript"],
                    plugins: ["@babel/plugin-syntax-jsx"],
                },
            },
        },
        plugins: { "react-hooks": reactHooks },
        rules: {
            ...js.configs.recommended.rules,
            // TypeScript checks names, while Babel also parses type-only references.
            "no-undef": "off",
            "no-unused-vars": "off",
            "no-case-declarations": "warn",
            "no-empty": ["error", { allowEmptyCatch: true }],
            "no-useless-assignment": "warn",
            "no-unsafe-optional-chaining": "warn",
            "no-console": "warn",
            "react-hooks/rules-of-hooks": "error",
            "react-hooks/exhaustive-deps": "warn",
        },
    },
];
