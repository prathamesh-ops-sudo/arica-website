import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets"),
    },
  },
  css: {
    postcss: {
      plugins: [],
    },
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true,
    modulePreload: {
      resolveDependencies: (_filename, dependencies) =>
        dependencies.filter((dependency) => !dependency.includes("/three-")),
    },
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("/node_modules/react/") || id.includes("/node_modules/react-dom/")) {
            return "react";
          }
          if (id.includes("/node_modules/framer-motion/")) return "motion";
          if (id.includes("/node_modules/@tanstack/react-query/")) return "query";
          if (id.includes("/node_modules/lucide-react/")) return "icons";
          if (id.includes("/node_modules/three/")) return "three";
          if (id.includes("/node_modules/gsap/")) return "gsap";
        },
      },
    },
  },
  server: {
    host: "0.0.0.0",
    allowedHosts: true,
    fs: {
      strict: true,
      deny: ["**/.*"],
    },
  },
});
