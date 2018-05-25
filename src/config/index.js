const CONFIG = {
  development: {
    apiHost: '' // 不便透露
  },
  production: {
    apiHost: '' // 不便透露
  }
};

module.exports = CONFIG[process.env.NODE_ENV];
