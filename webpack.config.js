const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const path = require('path');
const config = {
    entry: {
        vendor: [
            'angular',
            'angular-route',
            'angular-animate',
            'angular-aria',
            'angular-messages',
            'angular-material'
        ],
        app: path.resolve(__dirname, './app/index.js'),
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'js/bundle.js',
        chunkFilename: 'js/vendor.js'
    },
    resolve: {
        alias: {
            code: path.resolve(__dirname, './app')
        }
    },
    module: {
        noParse: []
    },
    optimization: {
        minimizer: [
            new UglifyJsPlugin({
                'sourceMap': false,
                'uglifyOptions': {
                    'mangle': false
                }
            })
        ],
        splitChunks: {
            cacheGroups: {
                vendor: {
                    chunks: 'initial',
                    test: 'vendor',
                    name: 'vendor',
                    enforce: true
                }
            }
        }
    },
    devServer: {
        contentBase: path.join(__dirname, 'dist'),
        compress: true,
        port: 8888
    },
    plugins: [
        new CleanWebpackPlugin(['dist']),
        new CopyWebpackPlugin([{
            from: 'app/views',
            to: 'views',
            toType: 'dir'
        }, {
            from: 'app/index.html',
            to: 'index.html',
            toType: 'file'
        }], { copyUnmodified: true })
    ]
};
const deps = [
    './node_modules/angular/angular.min.js',
    './node_modules/angular-route/angular-route.min.js',
    './node_modules/angular-animate/angular-animate.min.js',
    './node_modules/angular-aria/angular-aria.min.js',
    './node_modules/angular-messages/angular-messages.min.js',
    './node_modules/angular-material/angular-material.min.js'
];
deps.forEach(i => {
    let pt = path.resolve(__dirname, i);
    config.resolve.alias[i.split(path.sep)[1]] = pt;
    config.module.noParse.push(pt);
});
module.exports = config;