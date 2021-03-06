const TerserPlugin = require("terser-webpack-plugin");

const path = require("path");

module.exports = {
  mode: "production",
  entry: "./app/javascript/packs/decidim-bulletin_board.js",
  output: {
    path: path.resolve(
      __dirname,
      "..",
      "decidim-bulletin_board-ruby",
      "app",
      "assets",
      "javascripts",
      "decidim",
      "bulletin_board"
    ),
    filename: "decidim-bulletin_board.js",
    library: "decidimBulletinBoard",
    libraryTarget: "window",
  },
  resolve: {
    extensions: [".js", ".gql"],
  },
  module: {
    rules: [
      {
        test: /\.m?js/,
        resolve: {
          fullySpecified: false,
        },
      },
      {
        test: /\.(graphql|gql)$/,
        exclude: /node_modules/,
        loader: "graphql-tag/loader",
      },
    ],
  },
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        extractComments: false,
      }),
    ],
  },
};
