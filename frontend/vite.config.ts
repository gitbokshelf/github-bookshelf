import { defineConfig } from "vite";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
const hosting = JSON.parse(readFileSync(new URL("../vercel.json", import.meta.url), "utf8"));
export default defineConfig({
  preview: {
    headers: Object.fromEntries(hosting.headers[0].headers
      .filter((header: { key: string }) => header.key !== "Strict-Transport-Security")
      .map((header: { key: string; value: string }) => [header.key, header.key === "Content-Security-Policy" ? header.value.replace("; upgrade-insecure-requests", "") : header.value])),
  },
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
});
