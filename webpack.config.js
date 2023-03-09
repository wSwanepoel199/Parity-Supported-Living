const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WorkboxWebpackPlugin = require('workbox-webpack-plugin');
const Dotenv = require('dotenv-webpack');
const CopyPlugin = require('copy-webpack-plugin');
const CompressionPlugin = require("compression-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const TerserWebpackPlugin = require("terser-webpack-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const InterpolateHtmlPlugin = require('react-dev-utils/InterpolateHtmlPlugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const webpack = require('webpack');
const dotenv = require('dotenv');

module.exports = function (_env, argv) {
  dotenv.config();

  const isProduction = argv.mode === "production";
  const isDevelopment = !isProduction;

  const PUBLIC_PATH = process.env.PUBLIC_PATH || '/';
  const PUBLIC_URL = process.env.PUBLIC_URL || '.';
  const REACT_APP_API_URL = process.env.REACT_APP_API_URL || 'http://192.168.1.2:5000';

  const webpackPlugins = [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'public/index.html'),
      filename: 'index.html',
      inject: true,
    }),
    new InterpolateHtmlPlugin(HtmlWebpackPlugin, {
      'PUBLIC_URL': PUBLIC_URL
    }),
    new webpack.DefinePlugin({
      // 'process.env': JSON.stringify(process.env),
      "process.env.NODE_ENV": JSON.stringify(
        isProduction ? "production" : "development"
      ),
      'process.env.PUBLIC_PATH': JSON.stringify(PUBLIC_PATH),
      'process.env.PUBLIC_URL': JSON.stringify(PUBLIC_URL),
      'process.env.REACT_APP_API_URL': JSON.stringify(REACT_APP_API_URL),
    }),
    new Dotenv(),
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
      exclude: ["service-worker.js"],
      test: /\.js(\?.*)?$/,
      minRatio: 0.8,
      deleteOriginalAssets: false,
    }),
    isProduction &&
    new MiniCssExtractPlugin({
      filename: "static/css/[name].[contenthash:8].css",
      chunkFilename: "static/css/[name].[contenthash:8].chunk.css"
    }),
    isDevelopment && new BundleAnalyzerPlugin(),
  ].filter(Boolean);

  if (isProduction) {
    webpackPlugins.push(new WorkboxWebpackPlugin.InjectManifest({
      swSrc: './src/service-worker.js',
      swDest: 'service-worker.js',
    }));
  }

  return {
    devtool: isDevelopment ? "cheap-module-source-map" : "source-map",
    entry: {
      'app': "./src/index.js",
    },
    output: {
      path: path.resolve(__dirname, "build"),
      filename: "static/js/[name].[contenthash:8].js",
      publicPath: PUBLIC_PATH,
      clean: true,
      devtoolModuleFilenameTemplate: info => path.resolve(info.absoluteResourcePath).replace(/\\/g, '/'),
    },
    devServer: {
      compress: true,
      historyApiFallback: true,
      open: true,
      overlay: true
    },
    module: {
      rules: [
        {
          test: /\.worker\.js$/,
          loader: "worker-loader"
        },
        // {
        //   test: /\.css$/,
        //   use: [
        //     isProduction ? MiniCssExtractPlugin.loader : "style-loader",
        //     "css-loader"
        //   ]
        // },
        {
          test: /\.css$/i,
          include: path.resolve(__dirname, 'src'),
          use: [
            "style-loader",
            {
              loader: "css-loader",
              options: {
                importLoaders: 1
              }
            },
            'postcss-loader'],
        },
        {
          test: /\.(js|jsx|ts|tsx)$/,
          exclude: /(node_modules|bower_components)/,
          use: {
            loader: "babel-loader",
            options: {
              // presets: ['@babel/preset-env', ['@babel/preset-react', { "runtime": "automatic" }]],
              cacheDirectory: true,
              cacheCompression: false,
              envName: isProduction ? "production" : "development"
            }
          }
        },
        // {
        //   test: /\.(png|svg|jpg|jpeg|gif|ico)$/,
        //   exclude: /node_modules/,
        //   use: ['file-loader?name=[name].[ext]'] // ?name=[name].[ext] is only necessary to preserve the original file name
        // },
        {
          test: /\.(png|jpg|gif)$/i,
          use: {
            loader: "url-loader",
            options: {
              limit: 8192,
              name: "static/media/[name].[hash:8].[ext]"
            }
          }
        },
        {
          test: /\.svg$/,
          use: ["@svgr/webpack"]
        },
        {
          test: /\.(eot|otf|ttf|woff|woff2)$/,
          loader: require.resolve("file-loader"),
          options: {
            name: "static/media/[name].[hash:8].[ext]"
          }
        }
      ]
    },
    resolve: {
      extensions: [".js", ".jsx", ".ts", ".tsx"]
    },
    optimization: {
      minimize: isProduction,
      minimizer: [
        new TerserWebpackPlugin({
          terserOptions: {
            compress: {
              comparisons: false
            },
            mangle: {
              safari10: true
            },
            sourceMap: true,
            output: {
              comments: false,
              ascii_only: true
            },
            warnings: false
          }
        }),
        new CssMinimizerPlugin()
      ],
      innerGraph: false,
      splitChunks: {
        chunks: "all",
        minSize: 20000,
        maxInitialRequests: 20,
        maxAsyncRequests: 20,
        cacheGroups: {
          vendors: {
            test: /[\\/]node_modules[\\/]/,
            name(module, chunks, cacheGroupKey) {
              const packageName = module.context.match(
                /[\\/]node_modules[\\/](.*?)([\\/]|$)/
              )[1];
              return `${cacheGroupKey}.${packageName.replace("@", "")}`;
            },
            priority: -10,
            reuseExistingChunk: true,

          },
          common: {
            minChunks: 2,
            priority: -20
          }
        }
      },
      runtimeChunk: 'multiple'
    },
    plugins: webpackPlugins,
  };
};