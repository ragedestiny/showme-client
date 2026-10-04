// Create React App loads this file automatically when you run `npm start`.
// It does locally what public/_redirects does on Netlify: requests to
// localhost:3000/api/... are forwarded to the Firebase emulator, so the
// browser sees one site and accepts the login cookie.
// (CRA requires this file to use require/module.exports, not import/export.)
const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    createProxyMiddleware("/api", {
      target: "http://127.0.0.1:5001",
      // /api/MyPage -> /showme-backend-789/us-central1/apiv2/MyPage
      pathRewrite: { "^/api": "/showme-backend-789/us-central1/apiv2" },
      changeOrigin: true,
    })
  );
};
