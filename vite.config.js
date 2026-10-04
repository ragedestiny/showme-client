import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  // JSX support and instant refresh when you save a component
  plugins: [react()],

  server: {
    // Google only allows its sign-in button on origins approved in Google
    // Cloud, and http://localhost:3000 is the approved one.
    port: 3000,
    strictPort: true,
    // Does locally what public/_redirects does on Netlify: requests to
    // localhost:3000/api/... are forwarded to the Firebase emulator, so the
    // browser sees one site and accepts the httpOnly login cookie.
    proxy: {
      "/api": {
        target: "http://127.0.0.1:5001",
        changeOrigin: true,
        // /api/MyPage -> /showme-backend-789/us-central1/apiv2/MyPage
        rewrite: (path) =>
          path.replace(/^\/api/, "/showme-backend-789/us-central1/apiv2"),
      },
    },
  },

  build: {
    // Netlify publishes the build/ folder (Create React App's default)
    outDir: "build",
  },

  test: {
    // A pretend browser, so component tests have somewhere to draw
    environment: "jsdom",
    setupFiles: ["./src/test/setup.js"],
    // TEMPORARY: mdb-react-ui-kit 6 ships old-style code labelled as modern,
    // so tests run it through Vite's converter (as the browser build does).
    server: { deps: { inline: ["mdb-react-ui-kit"] } },
  },
});
