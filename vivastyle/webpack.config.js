const path = require('path')
const HTMLWebpackPlugin = require('html-webpack-plugin')
const {
    CleanWebpackPlugin
} = require('clean-webpack-plugin')
const CopyWebpackPlugin = require("copy-webpack-plugin");

const isDev = process.env.NODE_ENV === 'development'
const isProd = !isDev

const mainPath = isDev ? 'dist' : 'public'

const PATHS = {
    js: 'js',
    img: `${mainPath}/images`,
    css: 'css',
    fonts: `${mainPath}/fonts`,
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
    output: {
        path: path.resolve(__dirname, 'dist')
    },
    plugins: [
        new HTMLWebpackPlugin({
            filename: 'index.html',
            template: 'index.html'
        }),
        new CopyWebpackPlugin({
            patterns: [
                //{
                //     from: path.resolve(__dirname, 'src/favicon.ico'),
                //     to: path.resolve(__dirname, 'dist')
                //   },
                  {
                    from: path.resolve(__dirname, 'src/images'),
                    to: path.join(__dirname, PATHS.img),
                  },
                //   {
                //     from: path.resolve(__dirname, 'src//fonts'),
                //     to: path.join(__dirname, PATHS.fonts),
                //   },
                {
                    from: path.resolve(__dirname, 'src/js'),
                    to: path.join(__dirname, PATHS.js),
                },
                //   {
                //     from: path.resolve(__dirname, 'src/styles'),
                //     to: path.join(__dirname, PATHS.css),
                //   },
            ]
        }),
        new CleanWebpackPlugin()
    ],
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ["style-loader", "css-loader"],
            },
            {
                test: /\.s[ac]ss$/i,
                use: ["style-loader", "css-loader", "sass-loader"],
            },
            {
                test: /\.m?js$/,
                exclude: /(node_modules|bower_components)/,
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