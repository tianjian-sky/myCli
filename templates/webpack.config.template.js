var path = require('path')
var webpack = require('webpack')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var rootPath = path.resolve(__dirname, './')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const TransferWebpackPlugin = require('transfer-webpack-plugin');
const env = process.env.NODE_ENV
const config = require(path.resolve(__dirname, 'src/config/config.' + env))

module.exports = {
    // devtool: 'source-map',
    entry: {
        main: ['./src/main.js']
    },
    output: {
        path: rootPath + '/dist/',
        filename: '[name].[chunkhash].js?'
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'src/'),
            'vue': 'vue/dist/vue.js',
            'config': path.resolve(__dirname, 'src/config/config.' + env),
        },
        extensions: ['.js', '.vue']
    },
    resolveLoader: {
        alias: {
            'scss-loader': 'sass-loader',
        },
    },
    module: {
        rules: [
            {
                test: /\.vue$/,
                use: ['vue-loader']
            },    
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader'
                }
            },
            {
                test: /\.json$/,
                use: 'json-loader'
            },
            {
                test: /\.css$/,
                // use: [
                //     {loader: 'style-loader'},
                //     {loader: 'css-loader'},
                //     {loader: 'postcss-loader'}
                // ]
                use: ['vue-style-loader', 'css-loader']
            },
            {
                test: /\.scss$/,
                use: ['vue-style-loader', 'css-loader', 'sass-loader']
            },
            {
                test: /\.(png|jpg|gif)$/,
                use: 'url-loader?limit=500000'
            },
            {
            test: /\.(ttf|svg|eot|woff)$/,
                use: ['file-loader']
            }
        ]
    },
    plugins: [
        new VueLoaderPlugin(),
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: './src/template/main.html',
            inject: 'body',
            hash: false,
            minify: {
                removeComments: true,
                collapseWhitespace: false
            },
            chunksSortMode: 'dependency',
            templateParameters: {
                // 'tkAppId': config.TK_APPID
            },
        }),
        new webpack.optimize.ModuleConcatenationPlugin(),
        //拷贝服务器资源到dist目录
        new TransferWebpackPlugin([
            {from: './static'}
        ])
    ],
    devServer: {
        contentBase: path.join(__dirname, 'dist'),
        compress: true,
        host: 'localhost',
        // hot: true,
        port: 9000,
        writeToDisk: true,
        proxy: {
            // '/api': 'http://localhost:7777'
        }
    }
}