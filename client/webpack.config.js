// const path = require('path');
const webpack = require('webpack');

module.exports = {
  devServer: {
    inline: true,
    contentBase: './build',
    port: 3000
  },
  devtool: 'cheap-module-eval-source-map',
  entry: './src/js/index.js',
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel',
        exclude: /node_modules/,
        query: {
          presets: ['es2015', 'react']
        }
      },
      {
        test: /\.scss/,
        loader: 'style-loader!css-loader!sass-loader'
      },
      {
        test: /\.jsx?$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel',
        query: {
          presets: ['es2015', 'react', 'env']
        }
      }
    ]

  },
  output: {
    path: '../public/fe',
    filename: 'js/bundle.min.js'
  },
  plugins: [
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.optimize.UglifyJsPlugin({mangle: false, sourcemap: false}),
  ]
};
