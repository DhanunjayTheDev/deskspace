import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig(({ mode }) => {
  return {
    plugins: [react()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    server: {
      port: 3000,
    },
    build: {
      outDir: "dist",
      sourcemap: false,
      rollupOptions: {
        output: {
          // Function form rather than the object shorthand: Rolldown (Vite 8)
          // only accepts a function, and Rollup accepts both, so this survives
          // the bundler swap.
          manualChunks(id) {
            if (!id.includes("node_modules")) return;
            if (id.includes("framer-motion") || id.includes("motion-dom")) return "motion";
            if (
              id.includes("react-router") ||
              id.includes("/react-dom/") ||
              id.includes("/react/")
            ) {
              return "vendor";
            }
          },
        },
      },
    },
  };
});
