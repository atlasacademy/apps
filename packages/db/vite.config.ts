import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import eslint from "vite-plugin-eslint2";
import svgrPlugin from "vite-plugin-svgr";

export default defineConfig({
    base: "/db/",
    plugins: [react(), eslint(), svgrPlugin()],
    server: {
        port: 3000,
    },
    resolve: {
        preserveSymlinks: true,
    },
    build: {
        target: "ios12",
        outDir: "build",
        chunkSizeWarningLimit: 1000,
    },
    optimizeDeps: {
        // https://vitejs.dev/guide/dep-pre-bundling.html#monorepos-and-linked-dependencies
        include: ["@atlasacademy/api-connector", "@atlasacademy/api-descriptor"],
    },
});
