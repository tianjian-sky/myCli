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
                exclude: file =>{
                    return (/node_modules/.test(file) && (/element-ui[\/\\]lib/.test(file) || !/element-ui/.test(file))) // 引入node_models里的vue组件也需要预处理
                },
                use: [{
                    loader: 'babel-loader',
                    options: {
                        configFile: path.resolve(__dirname, '.babelrc') // 引入node_models里的vue组件也需要预处理，elment-ui本身无.babelrc，因此指定一个全局的babel配置
                    }
                }]
            },
            {
                test: /\.json$/,
                use: 'json-loader'
            },
            {
                test: /\.css$/,
                use: ['vue-style-loader', 'css-loader', 'postcss-loader']
            },
            {
                test: /\.scss$/,
                use: ['vue-style-loader', 'css-loader', 'sass-loader', 'postcss-loader']
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