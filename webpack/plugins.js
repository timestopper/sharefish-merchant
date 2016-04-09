var path = require('path');
var util = require('util');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var webpack = require('webpack');
var pkg = require('../package.json');

var DEBUG = process.env.NODE_ENV === 'development';
var STAGING = process.env.NODE_ENV === 'staging';
var TEST = process.env.NODE_ENV === 'test';

var cssBundle = path.join('styles', util.format('[name].%s.css', pkg.version));

var plugins = [
  new webpack.optimize.OccurenceOrderPlugin(),
  new webpack.ProvidePlugin({
    $: "jquery",
    jQuery: "jquery"
  })
];
if (DEBUG) {
  plugins.push(
    new webpack.HotModuleReplacementPlugin()
  );
} else if (!TEST) {
  plugins.push(
    new ExtractTextPlugin(cssBundle, {
      allChunks: true
    }),
    new webpack.optimize.UglifyJsPlugin(),
    new webpack.optimize.DedupePlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production')
      }
    }),
    new webpack.NoErrorsPlugin()
  );
}

module.exports = plugins;
