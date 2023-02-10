const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WorkboxWebpackPlugin = require('workbox-webpack-plugin');
// const Dotenv = require('dotenv-webpack');
const CopyPlugin = require('copy-webpack-plugin');
const CompressionPlugin = require("compression-webpack-plugin");

const webpack = require('webpack');
const dotenv = require('dotenv');

dotenv.config();

const webpackPlugins = [
  new HtmlWebpackPlugin({
    template: path.resolve(__dirname, 'public/index.html'),
    filename: 'index.html',
  }),
  // new Dotenv({
  //   // path: './.env', // Path to .env file (this is the default)
  //   systemvars: true,
  // }),
  new webpack.DefinePlugin({
    'process.env': JSON.stringify(process.env)
  }),
  new CopyPlugin({
    patterns: [
      { from: './public/PSLPineapple.ico', to: '' },
      { from: './public/manifest.json', to: '' },
      { from: './public/PSLPineapple192.png', to: '' },
      { from: './public/PSLPineapple512.png', to: '' },
    ],
  }),
  new CompressionPlugin({
    filename: "[path][base].gz[query]",
    algorithm: "gzip",
    exclude: "service-worker.js",
    test: /\.js(\?.*)?$/i,
    threshold: 10240,
    minRatio: 0.8,
    deleteOriginalAssets: true,
  })
];

if ('production' === process.env.NODE_ENV) {
  webpackPlugins.push(new WorkboxWebpackPlugin.InjectManifest({
    swSrc: './src/service-worker.js',
    swDest: 'service-worker.js',
  }));
}


module.exports = {
  entry: {
    'app': "./src/index.js",
  },
  output: {
    path: path.resolve(__dirname, "build"),
    filename: '[name].js',
    clean: true,
  },
  devServer: {
    static: {
      directory: path.resolve(__dirname, 'public'),
    },
    port: 3000,
    open: true,
    hot: true,
    compress: true,
    historyApiFallback: true,
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        include: path.resolve(__dirname, 'src'),
        use: ['style-loader', 'css-loader', 'postcss-loader'],
      },
      {
        test: /\.svg$/,
        use: ['@svgr/webpack'],
      },
      {
        test: /\.?js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ['@babel/preset-env', ['@babel/preset-react', { "runtime": "automatic" }]]
          }
        }
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif|ico)$/,
        exclude: /node_modules/,
        use: ['file-loader?name=[name].[ext]'] // ?name=[name].[ext] is only necessary to preserve the original file name
      }
    ]
  },
  optimization: {
    innerGraph: false,
    minimize: true,
  },
  plugins: webpackPlugins,
};