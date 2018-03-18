const debug = process.env.NODE_ENV !== "production";
const webpack = require("webpack");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin")

module.exports = {
  context: __dirname,
  devtool: debug ? "inline-sourcemap" : undefined,
  mode: "production",
  entry: "./assets/js/main.js",
  output: {
    path: __dirname + "/static",
    filename: "bundle.min.js"
  },
  plugins: [
    new UglifyJsPlugin({sourceMap: true}),
    new webpack.BannerPlugin({banner: "Copyright 2018 discordboats.club. All rights reserved."})
  ]
};