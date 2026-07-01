import { defineConfig } from "vite";

export default defineConfig({
  build: {
    lib: {
      entry: "src/washing-machine-card.ts",
      formats: ["es"],
      fileName: () => "washing-machine-card.js",
    },
    outDir: "dist",
    emptyOutDir: true,
    rollupOptions: {
      output: {
        inlineDynamicImports: true,
      },
    },
    minify: "esbuild",
  },
});
