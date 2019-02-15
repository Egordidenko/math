let webpack = require('webpack');
let path = require('path');
let ExtractTextPlugin = require('extract-text-webpack-plugin');
let autoprefixer = require('autoprefixer');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const cssnano = require('cssnano');
const NODE_ENV = process.env.NODE_ENV;

module.exports = {
    mode: NODE_ENV,
    context: __dirname,
    entry: {
        polyfills: './dev/js/polyfills.js',
        index: './dev/js/entry.js'
    },
    output: {
        filename: '[name].app.js',
        path: __dirname + '/prod/build/',
        publicPath: '/build/',
        library: '[name]',
    },
    optimization: {
        splitChunks: {
            chunks: "async",
            minSize: 30000,
            minChunks: 1,
            maxAsyncRequests: 5,
            maxInitialRequests: 3,
            automaticNameDelimiter: '~',
            name: true,
            cacheGroups: {
                vendors: {
                    test: /[\\/]node_modules[\\/]/,
                    priority: -10
                },
                default: {
                    minChunks: 2,
                    priority: -20,
                    reuseExistingChunk: true
                }
            }
        }
    },
    resolve: {
        extensions: ['*', '.js', '.jsx'],
        modules: ['./dev/js', 'node_modules', './dev/css', './dev/images']
    },
    module: {
        rules: [
            {
                test: /\.jsx?$|\.js$/,
                exclude: /node_modules/,
                loader: "babel-loader",
                query: {
                    presets: ["@babel/preset-env"]
                }
            },
            {
                test: /\.woff2?$|\.ttf$|\.eot$|\.svg$|\.png|\.jpe?g|\.gif$|\.mp4$|\.webm$/,
                loader: 'file-loader'
            }
        ]
    },
    plugins: [
        new ExtractTextPlugin({
            filename: 'style.css',
            disable: false,
            allChunks: true
        }),
        new webpack.ProvidePlugin({
            Swiper:  'swiper'
        }),
        new CleanWebpackPlugin(['prod/build'])
    ],
    watch: NODE_ENV == 'development',
    watchOptions: {
        aggregateTimeout: 100
    },
    devtool: NODE_ENV == 'development' ? "eval-source-map" : "",
    devServer: {
        before(app) {
            let arr = [
                '/form-json-response.json',
            ];
            for (let i = 0; i < arr.length; i++) {
                app.post(arr[i], function(req, res) {
                    res.redirect(arr[i]);
                });
            }
        }
    }
};

if (NODE_ENV == 'production') {
    module.exports.plugins.push(
        new UglifyJsPlugin({
            uglifyOptions: {
                cache: true,
                compress: true,
                parallel: true,
                output: {
                    comments: false,
                    beautify: false,
                }
            }
        })
    );
    module.exports.module.rules.push(
         {
            test: /\.scss$/,
            use: ExtractTextPlugin.extract({
                fallback: 'style-loader',
                use: [
                    {
                        loader: 'css-loader?-autoprefixer',
                        options:  { minimize: true }
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            plugins: [
                                cssnano({
                                    preset: ['default', {
                                        discardComments: {
                                            removeAll: true
                                        }
                                    }]
                                })
                            ]
                        }
                    },
                    'sass-loader'
                ],
                publicPath: './'
            })
         }
    );
} else if (NODE_ENV == 'none') {
    module.exports.plugins.push(
        new UglifyJsPlugin({
            uglifyOptions: {
                cache: true,
                compress: false,
                parallel: true,
                sourceMap: true,
                output: {
                    comments: false,
                    beautify: true
                }
            }
        })
    );
    module.exports.module.rules.push(
        {
            test: /\.scss$/,
            use: ExtractTextPlugin.extract({
                fallback: 'style-loader',
                use: [
                    {
                        loader: 'css-loader?-autoprefixer&sourceMap=true',
                        options:  {
                            minimize: false,
                            sourceMap: true
                        }
                    },
                    'postcss-loader',
                    'sass-loader'
                ],
                publicPath: './'
            })
        }
    );
} else if (NODE_ENV == 'development') {
    module.exports.module.rules.push(
        {
            test: /\.scss$/,
            use: [
                {
                    loader: 'style-loader'
                },
                {
                    loader: 'css-loader'
                },
                {
                    loader: 'sass-loader', options: {
                        sourceMap: true
                    }
                }
            ]
        }
    );
}