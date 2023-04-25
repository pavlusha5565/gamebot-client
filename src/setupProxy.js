const { URL } = require("url");
const { createProxyMiddleware } = require("http-proxy-middleware");

const devApiProxy = process.env.REACT_APP_API_PROXY;

function applyProxy(app, from, to) {
  const url = new URL(to);
  const pathname = url.pathname;
  const origin = url.origin;

  app.use(
    from,
    createProxyMiddleware(from, {
      target: origin,
      changeOrigin: true,
      pathRewrite: {
        ["^" + from]: pathname,
      },
    })
  );
}

module.exports = (app) => {
  if (devApiProxy) {
    applyProxy(app, "/api", devApiProxy);
  }
};
