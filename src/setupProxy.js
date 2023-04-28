const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://localhost:9100', // 프록시 서버 주소 입력
      changeOrigin: true,
    })
  );
};