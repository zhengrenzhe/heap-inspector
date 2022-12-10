const { resolve } = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");

import { Configuration as WebpackCfg } from "webpack";
import { Configuration as DevServeCfg } from "webpack-dev-server";

const base: WebpackCfg & DevServeCfg = {
  mode: "development",
  output: {
    path: resolve(__dirname, "./dist"),
    filename: "[name].js",
  },
  module: {
    rules: [
      {
        test: /\.(less|css)$/i,
        use: ["style-loader", "css-loader", "less-loader"],
      },
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".less", ".js", ".jsx"],
    alias: {
      "@web": resolve(__dirname, "./web"),
    },
  },
};

const main: WebpackCfg & DevServeCfg = Object.assign({}, base, {
  entry: {
    web: resolve(__dirname, "./web/web.ts"),
  },
  devServer: {
    port: 3000,
    host: "0.0.0.0",
    headers: {
      "Cross-Origin-Embedder-Policy": "require-corp",
      "Cross-Origin-Opener-Policy": "same-origin",
    },
  },
  experiments: {
    asyncWebAssembly: true,
    topLevelAwait: true,
  },
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        parallel: true,
        terserOptions: {
          keep_classnames: true,
          keep_fnames: true,
        },
      }),
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      chunks: ["web"],
      filename: "index.html",
      inject: "body",
      template: resolve(__dirname, "./web/web.html"),
    }),
  ].concat([]),
});

const worker: WebpackCfg & DevServeCfg = Object.assign({}, base, {
  entry: {
    worker: resolve(__dirname, "./web/worker.ts"),
  },
  target: "webworker",
});

export default [main, worker];
