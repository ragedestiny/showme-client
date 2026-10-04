import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Writes build/version.txt containing the git commit the site was built from.
// Netlify provides it as COMMIT_REF. CI reads this file to know when a deploy
// of a specific commit is live (see qawolf-staging.yml, promote-production.yml).
const versionFile = () => ({
  name: "version-file",
  generateBundle() {
    this.emitFile({
      type: "asset",
      fileName: "version.txt",
      source: process.env.COMMIT_REF ?? "local",
    });
  },
});

export default defineConfig({
  // JSX support and instant refresh when you save a component
  plugins: [react(), versionFile()],

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
  },
});
