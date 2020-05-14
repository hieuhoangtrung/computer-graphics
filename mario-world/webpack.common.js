const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const FixStyleOnlyEntriesPlugin = require("webpack-fix-style-only-entries");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const TerserJSPlugin = require('terser-webpack-plugin');

const webpack = require('webpack');
const path = require('path');
const fs = require('fs');

// Host
const host = process.env.HOST || 'localhost';
// Required for babel-preset-react-app
process.env.NODE_ENV = 'development';

// App directory
const appDirectory = fs.realpathSync(process.cwd());
const resolveAppPath = relativePath => path.resolve(appDirectory, relativePath);

module.exports = {
  mode: 'development',
  entry: {
    app: ["./src/main.js"],
    // styles: resolveAppPath('assets/styles/styles.css'),
  },
  devServer: {
    contentBase: path.join(__dirname, 'public'),
    compress: true,
    hot: true,
    host,
    port: 3000,
  },
  output: {
    path: path.resolve(__dirname, "public"),
    filename: "js/bundle.js"
  },
  devtool: 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: '/',
            },
          },
          'css-loader',
        ],
      },
      {
        test: /\.(jpe?g|gif|png|svg|woff|ttf|wav|mp3|fbx|obj|p3d|gmax|max)$/i,
        use: [
          {
            loader: 'file-loader',
          },
        ],
      }
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      minify: true,
      template: resolveAppPath('index.html'),
      title: 'Computer Graphics',
    }),
    new webpack.ProvidePlugin({
      THREE: 'three'
    }),
    new MiniCssExtractPlugin({filename: "[name].css"}),
    new FixStyleOnlyEntriesPlugin(),
    new OptimizeCSSAssetsPlugin({})
  ],
  optimization: {
    minimizer: [new TerserJSPlugin({}), new OptimizeCSSAssetsPlugin({})],
  },
};
