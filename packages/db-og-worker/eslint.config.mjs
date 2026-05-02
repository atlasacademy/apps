import tsPlugin from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";

export default [
    {
        ignores: ["dist/**", "node_modules/**"],
    },
    {
        files: ["src/**/*.{js,ts}"],
        languageOptions: {
            parser: tsParser,
            parserOptions: {
                sourceType: "module",
            },
        },
        plugins: {
            "@typescript-eslint": tsPlugin,
        },
        rules: {
            ...tsPlugin.configs.recommended.rules,
            "@typescript-eslint/no-explicit-any": "off",
        },
    },
];
