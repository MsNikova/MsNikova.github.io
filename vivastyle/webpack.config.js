const path = require('path')
const HTMLWebpackPlugin = require('html-webpack-plugin')
const {
  CleanWebpackPlugin
} = require('clean-webpack-plugin')
const CopyWebpackPlugin = require("copy-webpack-plugin");
const TerserWebpackPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const isDev = process.env.NODE_ENV === 'development'
const isProd = !isDev
const filename = (ext) => (isDev ? `[name].${ext}` : `[name].[chunkhash].${ext}`)
const mainPath = isDev ? 'dist' : 'public'

const PATHS = {
  js: `js`,
  img: `${mainPath}/images`,
  css: `${mainPath}/css`,
  fonts: `${mainPath}/fonts`,
}

const optimization = () => {
  const config = {
    splitChunks: {
      chunks: 'all',
    },
  }

  if (isProd) {
    config.minimizer = [new TerserWebpackPlugin()]
  }

  return config
}

module.exports = {
  context: path.resolve(__dirname, 'src'),
  entry: {
    main: './js/index.js'
  },
  // resolve: {
  //     alias: {
  //       '@images': path.resolve(__dirname, 'src/images')
  //     }
  // },
  // output: {
  //   path: path.resolve(__dirname, 'dist')
  // },
  output: {
    filename: `${PATHS.js}/${filename('js')}`,
    path: path.resolve(__dirname, mainPath),
  },
  optimization: optimization(),
  devtool: isDev ? 'source-map' : 'eval',
  devServer: {
    port: 4200,
    hot: isDev
  },
  plugins: [
    new HTMLWebpackPlugin({
      filename: 'index.html',
      template: 'index.html'
    }),
    new MiniCssExtractPlugin({
      filename: `${PATHS.css}/${filename('css')}`,
    }),
    new CopyWebpackPlugin({
      patterns: [{
          from: path.resolve(__dirname, 'src/images'),
          to: path.join(__dirname, PATHS.img),

        },
        {
          from: path.resolve(__dirname, 'src/fonts'),
          to: path.join(__dirname, PATHS.fonts),
        },
        {
          from: path.resolve(__dirname, 'src/js'),
          to: path.join(__dirname, PATHS.js),
        },
        {
          from: path.resolve(__dirname, 'src/styles'),
          to: path.join(__dirname, PATHS.css),
        },
      ]
    }),
    new CleanWebpackPlugin()
  ],
  module: {
    rules: [{
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
        type: 'asset/resource'
      },
      {
        test: /\.s[ac]ss$/i,
        use: ["style-loader", "css-loader", "sass-loader"],
        type: 'asset/resource'
      },
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        type: 'asset/resource',
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
            plugins: ['@babel/plugin-proposal-object-rest-spread']
          }
        }
      },
      {
        test: /\.(gif|png|jpe?g|svg)$/i,
        type: 'asset/resource',
        use: [
          'file-loader',
          {
            loader: 'image-webpack-loader',
            options: {
              mozjpeg: {
                progressive: true,
              },
              optipng: {
                enabled: false,
              },
              pngquant: {
                quality: [0.65, 0.90],
                speed: 4
              },
              gifsicle: {
                interlaced: false,
              },
              webp: {
                quality: 75
              }
            }
          },
        ],
      },
    ]
  }
}