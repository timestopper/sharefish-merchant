var path = require('path');
var pkg = require('../package.json');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

var DEBUG = process.env.NODE_ENV === 'development';
var STAGING = process.env.NODE_ENV === 'staging';
var TEST = process.env.NODE_ENV === 'test';

var es6Loader = 'babel?presets[]=react,presets[]=es2015';
var lessLoader = 'style!css!less';
var cssLoader;
var fileLoader = 'file-loader?name=[path][name].[ext]';
var htmlLoader = [
  'file-loader?name=[path][name].[ext]',
  'template-html-loader?' + [
    'raw=true',
    'engine=lodash',
    'version=' + pkg.version,
    'title=' + pkg.name,
    'debug=' + DEBUG
  ].join('&')
].join('!');
var jsonLoader = ['json-loader'];

if (DEBUG || TEST) {
  cssLoader = [
    'style-loader',
    'css-loader?sourceMap&modules&localIdentName=[name]__[local]___[hash:base64:5]',
    'postcss-loader'
  ].join('!');
} else {
  lessLoader = ExtractTextPlugin.extract('css?sourceMap!less?sourceMap');
  cssLoader = ExtractTextPlugin.extract('style-loader', [
    'css-loader?modules&localIdentName=[hash:base64:5]',
    'postcss-loader'
  ].join('!'));
}

var loaders = [
  {
    test: /\.js?$/,
    exclude: /node_modules/,
    loader: es6Loader
  },
  {
    test: /\.jpe?g$|\.gif$|\.png$|\.ico|\.svg(\?v\=.*)?$|\.woff(\?v\=.*)?$|\.ttf(\?v\=.*)?$|\.eot(\?v\=.*)?$|\.woff?2(\?v\=.*)?/,
    loader: fileLoader
  },
  {
    test: /\.json$/,
    exclude: /node_modules/,
    loaders: jsonLoader
  },
  {
    test: /\.html$/,
    loader: htmlLoader
  },
  {
    test: /\.less$/,
    loader: lessLoader
  }
];

module.exports = loaders;
