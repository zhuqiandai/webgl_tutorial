const path = require("path");
const webpack = require("webpack")
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './js/index.js',
  output: {
    path: path.join(__dirname, 'public'),
    filename: 'js/[name].js'
  },

  mode: 'production',

  module: {
    rules: [
      {
        test: /.js$/,
        exclude: path.join(__dirname, 'node_modules'),
        use: 'babel-loader'
      }
    ]
  },

  plugins: [new HtmlWebpackPlugin()],

  devServer: {
    watchFiles: './dist',
  },

  performance: {
    maxAssetSize: 30000,
    maxEntrypointSize: 50000
  }
}
