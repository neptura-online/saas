import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          react: ["react", "react-dom"],
          animations: ["framer-motion"],
          icons: ["react-icons"],
        },
      },
    },
    chunkSizeWarningLimit: 1500,
    cssCodeSplit: true,
  },
});
