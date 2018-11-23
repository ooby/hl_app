const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const path = require('path');
const config = {
    entry: {
        entry: './app/index.js',
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'js/bundle.js',
    },
    resolve: {
        alias: {
            code: path.resolve(__dirname, './app')
        }
    },
    optimization: {
        minimizer: [
            new UglifyJsPlugin({
                sourceMap: false,
                uglifyOptions: {
                    mangle: false
                }
            })
        ],
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
module.exports = config;