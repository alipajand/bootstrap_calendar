'use strict';
require('./check-versions')();
const config = require('../config');
const opn = require('opn');
const ora = require('ora');
const path = require('path');
const express = require('express');
const webpack = require('webpack');
const webpackConfig = require('./webpack.dev.conf');
const proxyMiddleware = require('http-proxy-middleware');
const spinner = ora(`starting dev server`);

/**
 * default port where dev server listens for incoming traffic
 * @type {*|number}
 */
const port = process.env.PORT || config.dev.port;

/**
 * automatically open browser, if not set will be false
 * @type {boolean}
 */
const autoOpenBrowser = !!config.dev.autoOpenBrowser;

/**
 * Define HTTP proxies to your custom API backend
 * https://github.com/chimurai/http-proxy-middleware
 * @type {module.exports.dev.proxyTable|{}}
 */
const proxyTable = config.dev.proxyTable;

const app = express();
const compiler = webpack(webpackConfig);

const devMiddleware = require('webpack-dev-middleware')(compiler, {
    publicPath: webpackConfig.output.publicPath,
    quiet: true
});

const hotMiddleware = require('webpack-hot-middleware')(compiler, {
    log: false
});

/**
 * force page reload when html-webpack-plugin template changes
 */
compiler.plugin('compilation', function (compilation) {
    compilation.plugin('html-webpack-plugin-after-emit', function (data, cb) {
        hotMiddleware.publish({ action: 'reload' });
        cb();
    });
});

/**
 * enable hot-reload and state-preserving
 * compilation error display
 */
app.use(hotMiddleware);

/**
 * proxy api requests
 */
Object.keys(proxyTable).forEach(function (context) {
    let options = proxyTable[context];
    if (typeof options === 'string') {
        options = { target: options };
    }
    app.use(proxyMiddleware(options.filter || context, options));
});

/**
 * handle fallback for HTML5 history API
 */
app.use(require('connect-history-api-fallback')());

/**
 * serve webpack bundle output
 */
app.use(devMiddleware);

/**
 * serve pure static assets
 */
const staticPath = path.posix.join(config.dev.assetsPublicPath, config.dev.assetsSubDirectory);
app.use(staticPath, express.static('./static'));

const uri = 'http://localhost:' + port;

let _resolve;
const readyPromise = new Promise(resolve => {
    _resolve = resolve;
});

spinner.start();

devMiddleware.waitUntilValid(() => {
    spinner.stop();
    console.log('> Listening at ' + uri + '\n');
    // when env is testing, don't need open it
    if (autoOpenBrowser && process.env.NODE_ENV !== 'testing') {
        opn(uri);
    }
    _resolve();
});

const server = app.listen(port);

module.exports = {
    ready: readyPromise,
    close: () => {
        server.close();
        spinner.stop();
    }
};
