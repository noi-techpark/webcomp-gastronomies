// SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: CC0-1.0

const path = require("path");
const webpack = require("webpack");
var dotenv = require("dotenv").config({ path: __dirname + "/.env" });

const env = dotenv.parsed || {};

module.exports = {
  mode: "production",
  entry: path.resolve(__dirname, "./code/odh-gastronomies.js"),
  output: {
    path: path.resolve(__dirname, "./work/scripts"),
    filename: "odh-gastronomies.js",
  },
  plugins: [
    new webpack.DefinePlugin({
      "process.env.DOTENV": JSON.stringify(env),
      "process.env.TOURISM_BASE_PATH": JSON.stringify(
        env.TOURISM_BASE_PATH || ""
      ),
      "process.env.GEO_BASE_PATH": JSON.stringify(env.GEO_BASE_PATH || ""),
      "process.env.BASEMAP_STYLE_URL": JSON.stringify(
        env.BASEMAP_STYLE_URL || ""
      ),
    }),
  ],
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
        test: /\.css$/,
        use: [
          {
            loader: "css-loader",
            options: { exportType: "string" },
          },
        ],
      },
      {
        test: /\.scss$/,
        use: [
          {
            loader: "css-loader",
            options: { exportType: "string" },
          },
          { loader: "sass-loader", options: { api: "modern" } },
        ],
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
