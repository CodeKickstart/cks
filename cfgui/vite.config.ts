import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const CLIENT_ORIGIN = 3502;

export default defineConfig({
  server: {
    port: CLIENT_ORIGIN,
    proxy: {
      "/api": "http://localhost:4002",
    },
  },
  plugins: [react()],
});
