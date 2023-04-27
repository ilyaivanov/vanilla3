const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = (env, argv) => ({
  // entry: "./playground/index.ts",
  entry: "./src/index.ts",
  output: {
    filename: `app.js`,
    path: path.resolve(__dirname, "build"),
  },
  devtool: argv.mode === "development" ? "inline-source-map" : undefined,
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/i,
        loader: "ts-loader",
        exclude: ["/node_modules/"],
      },
      {
        test: /\.scss$/i,
        use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif|otf)$/i,
        type: "asset/resource",
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "public/index.html",
      favicon: "public/favicon.svg",
    }),
    new MiniCssExtractPlugin(),
  ],
  resolve: { extensions: [".ts", ".tsx", ".js", ".json", ".jpg"] },
});
