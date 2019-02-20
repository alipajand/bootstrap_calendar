'use strict';

const path = require('path');
const utils = require('./utils');
const webpack = require('webpack');
const config = require('../config');
const merge = require('webpack-merge');
const baseWebpackConfig = require('./webpack.base.conf');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const SWPrecacheWebpackPlugin = require('sw-precache-webpack-plugin');
const loadMinified = require('./load-minified');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');

const webpackConfig = merge(baseWebpackConfig, {
    mode: 'production',
    module: {
        rules: utils.styleLoaders({
            sourceMap: config.build.productionSourceMap,
            extract: true
        })
    },
    devtool: config.build.productionSourceMap ? config.build.devtool : false,
    output: {
        path: config.build.assetsRoot,
        filename: utils.assetsPath('js/[name].[chunkhash].js'),
        chunkFilename: utils.assetsPath('js/[id].[chunkhash].js')
    },
    optimization: {
        minimize: true,
        minimizer: [
            new TerserPlugin({
                terserOptions: {
                    ecma: 6,
                    compress: true,
                    cache: true,
                    parallel: true,
                    warnings: false,
                    mangle: true, // Note `mangle.properties` is `false` by default.
                    module: false,
                    toplevel: false,
                    nameCache: null,
                    ie8: false,
                    keep_classnames: undefined,
                    keep_fnames: false,
                    safari10: false,
                    output: {
                        comments: false,
                        beautify: false
                    },
                    extractComments: {
                        condition: /^\**!|@preserve|@license|@cc_on/i,
                        filename(file) {
                            return `${file}.LICENSE`;
                        }
                    }
                }
            }),
            new OptimizeCSSAssetsPlugin()
        ],
        splitChunks: {
            chunks: 'all',
            minChunks: 5,
            cacheGroups: {
                styles: {
                    name: 'styles',
                    test: /\.css$/,
                    chunks: 'all',
                    enforce: true
                }
            }
        }
    },
    plugins: [
        // extract css into its own file
        new MiniCssExtractPlugin({
            // Options similar to the same options in webpackOptions.output
            // both options are optional
            filename: utils.assetsPath('css/[name].[contenthash].css'),
            chunkFilename: utils.assetsPath('css/[id].[contenthash].css')
        }),

        // generate dist index.html with correct asset hash for caching.
        // you can customize output by editing /index.html
        // see https://github.com/ampedandwired/html-webpack-plugin
        new HtmlWebpackPlugin({
            filename: process.env.NODE_ENV === 'testing'
                ? 'index.html'
                : config.build.index,
            template: 'index.html',
            inject: true,
            minify: {
                removeComments: true,
                collapseWhitespace: true,
                removeAttributeQuotes: true
                // more options:
                // https://github.com/kangax/html-minifier#options-quick-reference
            },

            // necessary to consistently work with multiple chunks via CommonsChunkPlugin
            chunksSortMode: 'dependency',
            serviceWorkerLoader: `<script>${loadMinified(path.join(__dirname, './service-worker-prod.js'))}</script>`
        }),
        // keep module.id stable when vendor modules does not change
        new webpack.HashedModuleIdsPlugin(),

        // enable scope hoisting
        new webpack.optimize.ModuleConcatenationPlugin(),

        // split vendor js into its own file
        // service worker caching
        new SWPrecacheWebpackPlugin({
            cacheId: '3sootjobs',
            filename: 'service-worker.js',
            staticFileGlobs: [
                'dist/*.{js,html,ico,txt}',
                'dist/**/*.{js,js.gz,html,css,css.gz,svg,png,jpg,jpeg,woff,woff2}'
            ],
            minify: true,
            stripPrefix: 'dist/',
            runtimeCaching: [
                {
                    urlPattern: /^https:\/\/thecatapi\.com\/api\/images\/get\.php\?id/,
                    handler: 'cacheFirst'
                },
                {
                    urlPattern: /^https:\/\/fonts\.googleapis\.com\//,
                    handler: 'cacheFirst'
                },
                {
                    urlPattern: /^https:\/\/fonts\.gstatic\.com\//,
                    handler: 'cacheFirst'
                },
                {
                    urlPattern: /^https:\/\/code\.getmdl\.io\//,
                    handler: 'cacheFirst'
                }
            ]
        })
    ]
});

if (config.build.productionGzip) {
    const CompressionWebpackPlugin = require('compression-webpack-plugin');

    webpackConfig.plugins.push(
        new CompressionWebpackPlugin({
            algorithm: 'gzip',
            test: new RegExp(
                '\\.(' +
                config.build.productionGzipExtensions.join('|') +
                ')$'
            ),
            threshold: 10240,
            minRatio: 0.5
        })
    );
}

if (config.build.bundleAnalyzerReport) {
    const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
    webpackConfig.plugins.push(new BundleAnalyzerPlugin());
}

module.exports = webpackConfig;
