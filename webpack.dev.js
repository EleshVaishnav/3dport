const path = require('path');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  mode: 'development',
  devServer: {
    static: path.join(__dirname, '../src'),
    compress: true,
    port: 8080,
    hot: true,
    open: true
  }
});
