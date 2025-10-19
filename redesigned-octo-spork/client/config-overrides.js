const path = require('path');

module.exports = function override(config, env) {
  if (env === 'development') {
    config.devServer = {
      allowedHosts: 'all',
      host: '0.0.0.0',
      port: 5000,
      proxy: {
        '/api': {
          target: 'http://localhost:3001',
          changeOrigin: true
        }
      }
    };
  }
  return config;
};
