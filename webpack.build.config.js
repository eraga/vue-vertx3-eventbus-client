const webpack = require("webpack");
const version = require("./package.json").version;
const banner = "/**\n" + " * vue-vertx3-eventbus-client v" + version + "\n" + " * https://github.com/eraga/vue-vertx3-eventbus-client\n" + " * Released under the GPL-3.0 License.\n" + " */\n";
const Uglify = require("uglifyjs-webpack-plugin");

module.exports = [
    {
        devtool: "source-map",
        entry: __dirname +  "/src/VertxEventBus",
        output: {
            path: __dirname + "/dist",
            filename: "vue-vertx3-eventbus-client.js",
            library: "VueVertxEventBus",
            libraryTarget: "umd"
        },

        plugins: [
            new webpack.DefinePlugin({
                "process.env" : {
                    NODE_ENV : JSON.stringify("production")
                }
            }),
            new Uglify({
                sourceMap: true,
                uglifyOptions: {
                    output: {
                        // beautify: true, // comment out or set to false for production
                    },
                },
            }),
            new webpack.optimize.DedupePlugin(),
            new webpack.BannerPlugin({
                banner: banner,
                raw: true
            })
        ],

        module: {
            loaders: [
                {
                    test: /\.js?$/,
                    exclude: /node_modules/,
                    loader: "babel-loader"
                },
                {
                    "test": /\.vue$/,
                    "loader": "vue"
                }
            ]
        }
    }

];