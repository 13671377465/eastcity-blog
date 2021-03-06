const webpack = require('webpack')
const merge = require('webpack-merge')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const common = require('./webpack.common.js')
const path = require('path')

module.exports = merge(common, {
    output: {
        filename: '[name]-bundle.js',
        path: path.resolve('dist'),
        publicPath: '/'
    },
    devtool: 'inline-source-map',
    plugins: [
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