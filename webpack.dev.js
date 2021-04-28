const path = require("path");
const webpack = require("webpack");
var dotenv = require("dotenv").config({ path: __dirname + "/.env" });

module.exports = {
  mode: "development",
  entry: path.resolve(__dirname, "./code/odh-gastronomies.js"),
  watch: true,
  output: {
    path: path.resolve(__dirname, "./work/scripts"),
    filename: "odh-gastronomies.js",
  },
  plugins: [
    new webpack.DefinePlugin({
      "process.env.DOTENV": JSON.stringify(dotenv.parsed),
    }),
  ],
  // webpack-dev-server configuration
  devServer: {
    contentBase: path.resolve(__dirname, "./work"),
    publicPath: "/scripts/",
    watchContentBase: true,
    compress: true,
    port: 8080,
    open: true,
    openPage: "",
    overlay: true,
  },
  devtool: "inline-source-map",
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
            plugins: [
              "@babel/plugin-syntax-class-properties",
              "@babel/plugin-proposal-class-properties",
            ],
          },
        },
      },
      {
        test: /\.(s*)css$/,
        use: ["css-loader", "sass-loader"],
      },
      {
        test: /\.svg/,
        use: {
          loader: "svg-url-loader",
          options: {},
        },
      },
      {
        test: /\.(png|jpg|gif|ttf)$/i,
        use: [
          {
            loader: "url-loader",
            options: {
              limit: 10000,
            },
          },
        ],
      },
    ],
  },
};
