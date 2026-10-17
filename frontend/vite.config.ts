import { defineConfig } from "vite";
import { fileURLToPath } from "node:url";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
export default defineConfig({
  envDir: fileURLToPath(new URL("../backend/supabase/", import.meta.url)),
  base: "./",
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (
            id.includes("/node_modules/@supabase/") ||
            id.includes("/node_modules/iceberg-js/")
          )
            return "supabase";
          if (id.includes("/src/data/catalog.json")) return "catalog";
          if (id.includes("/node_modules/")) return "vendor";
        },
      },
    },
  },
  plugins: [react(), tailwindcss()],
  resolve: { alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) } },
});
