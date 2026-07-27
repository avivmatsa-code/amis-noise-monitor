import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  base: "/amis-noise-monitor/",
  plugins: [react()],
});
