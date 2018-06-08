const webpack = require('webpack')
const merge = require('webpack-merge')
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const common = require('./webpack.common.js')
const path = require('path')

module.exports = merge(common, {
    output: {
        filename: '[name]-bundle.js',
        path: path.resolve('dist'),
        publicPath: '/'
    },
    devtool: 'source-map',
    plugins: [
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('production')
        }),
        new UglifyJSPlugin({
            sourceMap: true
        }),
        new HtmlWebpackPlugin({
            template: './src/client/template/page.html',
            filename: './assets/page.ejs',
            chunks: ['display'],
        }),
        new HtmlWebpackPlugin({
            template: './src/client/template/platformpage.html',
            filename: './assets/platformpage.ejs',
            chunks: ['platform'],
        })
    ]
})
