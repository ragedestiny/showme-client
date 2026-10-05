import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tell from "./src/tellData.js";
import { phoneCarouselMedia } from "./src/config.js";

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

// What each page needs first. On a fresh load or reload, the browser would
// only learn about these after the app's main file had downloaded and run, so
// two tiny scripts in index.html ask for them straight away:
// 1. At the very top: the page's own code (each page is a separate file,
//    loaded on demand, see NavbarComp), and the collection page's sentences
//    (the app picks that request up in src/api/index.js).
// 2. After the stylesheets: the home page's first photo. The browser can't
//    draw anything until the stylesheets have arrived; starting the big photo
//    before them would make them share the connection with it, and the first
//    screen would appear later.
// Addresses are lowercase, without a trailing slash. File names change with
// every build, so the address-to-files list is written here.
const pageRoutes = {
  "/about": "About",
  "/admin": "Admin",
  "/collections": "Collection",
  "/login": "Login",
  "/mypage": "MyPage",
};

// The home page's first photo (see CarouselComp): the phone-shaped copy on
// phones held upright, the full photo everywhere else. The <picture> in
// CarouselComp makes the same choice, so the photo is never downloaded twice.
const firstPhoto = tell[0];
const preloadPhoto = (href, media) => ({
  rel: "preload",
  as: "image",
  fetchpriority: "high",
  href,
  media,
});
const homePhoto = [
  preloadPhoto(firstPhoto.phonePicture, phoneCarouselMedia),
  preloadPhoto(firstPhoto.picture, `not all and ${phoneCarouselMedia}`),
];

// The tiny script. `byAddress` lists, for each address, the <link> tags to add
// (as their attributes) and the API requests to start; the app finds those
// requests in window.earlyRequests. A tag with a `media` rule is only added on
// screens that match it, so even a browser that ignored the rule wouldn't
// download both photos.
const pageScript = (byAddress) => `(function () {
      var page = ${JSON.stringify(byAddress)}[location.pathname.toLowerCase().replace(/\\/+$/, "") || "/"];
      if (!page) return;
      (page.links || []).forEach(function (attributes) {
        if (attributes.media && !matchMedia(attributes.media).matches) return;
        var link = document.createElement("link");
        for (var name in attributes) link.setAttribute(name, attributes[name]);
        document.head.appendChild(link);
      });
      (page.requests || []).forEach(function (path) {
        var request = fetch("/api" + path);
        request.catch(function () {}); // the app deals with failures
        (window.earlyRequests = window.earlyRequests || {})[path] = request;
      });
    })();`;

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
      const atTheTop = {};
      for (const [address, page] of Object.entries(pageRoutes)) {
        const links = filesFor(page).map((file) => ({
          rel: "modulepreload",
          crossorigin: "",
          href: "/" + file,
        }));
        atTheTop[address] = { links };
      }
      atTheTop["/collections"].requests = ["/Collections"];
      const afterTheStylesheets = { "/": { links: homePhoto } };

      // 1. Right after <meta charset> (which must stay in the first 1024
      // bytes) and before the stylesheets: a script placed after them waits
      // for them to download before running
      const charset = '<meta charset="utf-8" />';
      if (!html.includes(charset)) throw new Error("index.html needs " + charset);
      // 2. At the end of <head>, after the app's stylesheet (Vite puts it there)
      const headEnd = "</head>";
      if (html.lastIndexOf('rel="stylesheet"') > html.indexOf(headEnd)) {
        throw new Error("Expected every stylesheet before " + headEnd);
      }
      return html
        .replace(charset, `${charset}\n    <script>${pageScript(atTheTop)}</script>`)
        .replace(headEnd, `  <script>${pageScript(afterTheStylesheets)}</script>\n  ${headEnd}`);
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
