import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/**/*.ts'],
  format: ["cjs"],
  tsconfig: "tsconfig.json",
  dts: true,
  splitting: false,
  clean: true
})