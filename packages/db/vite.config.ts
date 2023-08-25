import react from "@vitejs/plugin-react-swc";
import { defineConfig, splitVendorChunkPlugin } from "vite";
import eslint from "vite-plugin-eslint";
import svgrPlugin from "vite-plugin-svgr";

export default defineConfig({
    base: "/db/",
    plugins: [react(), eslint(), svgrPlugin(), splitVendorChunkPlugin()],
    server: {
        port: 3000,
    },
    build: {
        target: "ios11",
        outDir: "build",
        commonjsOptions: {
            include: [],
        },
        rollupOptions: {
            maxParallelFileOps: 100,
        },
        chunkSizeWarningLimit: 1000,
    },
    optimizeDeps: {
        // https://vitejs.dev/guide/dep-pre-bundling.html#monorepos-and-linked-dependencies
        include: ["@atlasacademy/api-connector", "@atlasacademy/api-descriptor"],
        // https://vitejs.dev/config/dep-optimization-options.html#optimizedeps-disabled
        // Setting this to false should enable optimizeDeps for both dev and build.
        // This way esbuild will convert dependencies to esm and we don't have to deal with @rollup/plugin-commonjs
        disabled: false,
    },
});
