const path = require('path')
const webpack = require('webpack')
const version = require('./package.json').version
const banner = '/**\n' + ' * vue-vertx3-eventbus-client v' + version + '\n' + ' * https://github.com/eraga/vue-vertx3-eventbus-client\n' + ' * Released under the GPL-3.0 License.\n' + ' */\n'

module.exports = [
  {
    devtool: 'source-map',
    entry: path.resolve() + '/src/VertxEventBus',
    output: {
      path: path.resolve() + '/dist',
      filename: 'vue-vertx3-eventbus-client.js',
      library: 'VueVertxEventBus',
      libraryTarget: 'umd',
    },

    plugins: [
      new webpack.optimize.UglifyJsPlugin({
        sourceMap: true,
        uglifyOptions: {
          output: {
            // beautify: true, // comment out or set to false for production
          },
        },
      }),
      new webpack.BannerPlugin({
        banner: banner,
        raw: true,
      }),
    ],

    module: {
      loaders: [
        {
          test: /\.js?$/,
          exclude: /node_modules/,
          loader: 'babel-loader',
        },
        {
          'test': /\.vue$/,
          'loader': 'vue',
        },
      ],
    },
  },
]
