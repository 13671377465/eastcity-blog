const webpack = require('webpack')
const path = require('path')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const ExtractTextWebpackPlugin = require('extract-text-webpack-plugin')

const displaycss = new ExtractTextWebpackPlugin('[name]-style.css')
const platformcss = new ExtractTextWebpackPlugin('[name]-style.css')

module.exports = {
    entry: {
        display: './src/client/pageindex.js',
        platform: './src/client/platformindex.js'
    },
    plugins: [
        new CleanWebpackPlugin('dist'),
        displaycss,
        platformcss
    ],
    module: {
        rules: [
            {
                test: /\.(scss|css)$/,
                use: ExtractTextWebpackPlugin.extract({
                    use: [{
                        loader: 'css-loader'
                    }, {
                        loader: 'postcss-loader'
                    },{
                        loader: 'sass-loader'
                    }]
                })
            },
            {
                test: /.js$/,
                loader: 'babel-loader',
                include: /src/,
                exclude: /node_modules/,
                query: {
                    presets: ['@babel/react', '@babel/preset-env'],
                    plugins: ['@babel/plugin-proposal-class-properties', ["import", { "libraryName": "antd", "libraryDirectory": "es", "style": "css" }]]
                }
            },
            {
                test: /\.(jpe?g|png|gif)$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 8192,
                            outputPath: 'images/'
                        }
                    }
                ]
            },
            {
                test: /\.(htm|html)$/,
                use: 'html-withimg-loader'
            }
        ]
    }
}