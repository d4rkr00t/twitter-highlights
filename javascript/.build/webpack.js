var configBuilder = require('./webpack-config.js');
var dest = process.env.WEBPACK_DEV ? 'dev' : 'public';

module.exports = configBuilder({
  entryPoint: './index.js',
  output: 'twitter-highlights.js',
  autoprefixer: ['last 2 versions'],
  debug: !!process.env.WEBPACK_DEV,
  devServer: {
    port: process.env.WEBPACK_DEV_PORT || 8080,
    publicPath: dest
  },
  paths: {
    dest: dest
  }
});
