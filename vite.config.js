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

// Each page's code is a separate file, loaded on demand (see NavbarComp).
// On a fresh load or reload of, say, /Collections, the browser would only
// learn it needs Collection-xxxx.js after the main file had downloaded and
// run. This adds a tiny script to index.html that starts downloading the
// current page's files straight away, alongside the main file. File names
// change with every build, so the address-to-files list is written here.
const pageRoutes = {
  "/about": "About",
  "/admin": "Admin",
  "/collections": "Collection",
  "/login": "Login",
  "/mypage": "MyPage",
};
const preloadCurrentPage = () => ({
  name: "preload-current-page",
  transformIndexHtml: {
    order: "post",
    handler(html, { bundle }) {
      if (!bundle) return html; // dev server: nothing is bundled
      const chunks = Object.values(bundle).filter((c) => c.type === "chunk");
      // Files index.html already loads (the main file and its imports)
      const entry = chunks.find((c) => c.isEntry);
      const alreadyLoaded = new Set([entry.fileName, ...entry.imports]);
      // A page's file plus the shared files it imports (e.g. MyPage needs Modal)
      const filesFor = (page) => {
        const chunk = chunks.find((c) =>
          c.facadeModuleId?.replaceAll("\\", "/").endsWith(`/src/pages/${page}.jsx`)
        );
        if (!chunk) throw new Error(`No build file found for page ${page}`);
        return [chunk.fileName, ...chunk.imports].filter((f) => !alreadyLoaded.has(f));
      };
      const files = Object.fromEntries(
        Object.entries(pageRoutes).map(([route, page]) => [route, filesFor(page)])
      );
      const script =
        `(function(){var f=${JSON.stringify(files)}` +
        `[location.pathname.toLowerCase().replace(/\\/+$/,"")];` +
        `(f||[]).forEach(function(n){var l=document.createElement("link");` +
        `l.rel="modulepreload";l.crossOrigin="";l.href="/"+n;` +
        `document.head.appendChild(l)})})()`;
      // Right after <meta charset> (which must stay in the first 1024 bytes)
      // and before the stylesheets: a script placed after them would wait
      // for them to download before running
      const charset = '<meta charset="utf-8" />';
      if (!html.includes(charset)) throw new Error("index.html needs " + charset);
      return html.replace(charset, `${charset}\n    <script>${script}</script>`);
    },
  },
});

export default defineConfig({
  // JSX support and instant refresh when you save a component
  plugins: [react(), versionFile(), preloadCurrentPage()],

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
