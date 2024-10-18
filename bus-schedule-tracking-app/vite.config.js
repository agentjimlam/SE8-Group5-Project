import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api-proxy": {
        // actual API that we want to call
        target: "https://datamall2.mytransport.sg",
        // change the origin of the request to avoid CORS issues
        changeOrigin: true,
        // rewrite the path to remove the /api-proxy prefix
        rewrite: (path) => path.replace(/^\/api-proxy/, ""),
      },
    },
  },
});
