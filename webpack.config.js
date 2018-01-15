var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var CleanWebpackPlugin = require('clean-webpack-plugin');
var WebpackMd5Hash = require('webpack-md5-hash');
//自带 -p 压缩出错 所以需要新版压缩文件。
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

// 引入css 单独打包插件
var ExtractTextPlugin = require("extract-text-webpack-plugin");


var env = process.env.NODE_ENV
var isDev = env == 'dev';

console.log(isDev);

module.exports = {
    devtool: 'source-map',
    entry: {
        main: [
            'webpack-dev-server/client?http://localhost:3000',
            'webpack/hot/only-dev-server',
            'react-hot-loader/patch',
            'babel-polyfill',
            './src/test.js'
        ],
        // 第三方库汇总输出   
        vendor: ['react',
            'react-dom',
            'moment', 'lodash', 'immutable', 'whatwg-fetch',
            // 只含antd的js部分
            // 'antd',
            // 各控件还需引入各自的样式文件
            // 'antd/lib/style/index.less'
        ]
    },
    output: {
        // path: path.join(__dirname, 'dist'),
        path: __dirname + '/dev',
        // filename: '[name]-[hash].js',
        // publicPath: '/dist/',

        filename: isDev ? '[name].js' : '[name]_[hash:8].js',
        // 使用require.ensure造成的延迟加载的代码文件
        chunkFilename: isDev ? 'chunk_[id]_[name].js' : 'chunk_[name]_[hash:8].js',


    },

    module: {

        rules: [{
            test: /\.js$/,
            exclude: /node_modules/,
            include: path.resolve(__dirname, "src"),
            use: [{
                // 编译新版本js语法为低版本js语法
                loader: 'babel-loader',
                options: {
                    //按需加载antd css等の3 
                    plugins: [["import", { libraryName: "antd", style: true }]],// `style: true` 会加载 less 文件 
                    presets: [
                        // 编译es2015版本的js
                        'babel-preset-es2015', 'babel-preset-stage-2',
                        // 编译jsx
                        'babel-preset-react'],


                } 
            }]


        },

        // {
        //     test: /.\src\c.js?$/,
        //     use: {
        //         loader: 'bundle-loader',
        //         options: {
        //             name: '[name]-async.'
        //         }
        //     }
        // },

        {
            test: /\.css$/,
            use: ['style-loader',
                {
                    loader: 'css-loader',
                    options: {
                        // 第三方组件未以module方式引入css，所以不能在全局开启css module
                        modules: false
                    }

                },
            ]
        }, {
            test: /\.less$/,
            use: ['style-loader',
                {
                    loader: 'css-loader',
                    options: {
                        modules: false
                    }
                },

                {
                    loader: 'less-loader',
                    options: {
                        modules: false,

                    }
                }]
        },



        ]
    },
    plugins: [

        // 设置生成css 的路径和文件名，会自动将对应entry入口js文件中引入的CSS抽出成单独的文件
        //    new ExtractTextPlugin('./dist/[name].min.css'),
        new ExtractTextPlugin("dist/[name].[contenthash:8].css"),//设置其路径(路径相对于path)
        // new UglifyJsPlugin({

        //     // 使用外部引入的新版本的js压缩工具
        //     exclude: /node_modules/,

        //     sourceMap: true,

        //     parallel: true,

        //     uglifyOptions: {

        //         ie8: false,

        //         ecma: 6,

        //         warnings: false,

        //         mangle: true,
        //         // debug false

        //         output: {

        //             comments: false,

        //             beautify: false,
        //             // debug true

        //         },

        //         compress: {

        //             // 在UglifyJs删除没有用到的代码时不输出警告

        //             warnings: false,

        //             // 删除所有的 `console` 语句

        //             // 还可以兼容ie浏览器

        //             drop_console:
        //                 true,

        //             // 内嵌定义了但是只用到一次的变量

        //             collapse_vars:
        //                 true,

        //             // 提取出出现多次但是没有定义成变量去引用的静态值

        //             reduce_vars:
        //                 true,

        //         }

        //     }

        // }),

        new webpack.HotModuleReplacementPlugin(),
        // momentjs包含大量本地化代码，需筛选
        new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /en-ca|zh-cn/),

        // 自动填充js、css引用进首页
        new HtmlWebpackPlugin({
            title: 'project2',
            template: path.resolve('./src/', 'index.ejs'),
            inject: true // Inject all scripts into the body
        }),

        // 设置环境变量
        new webpack.DefinePlugin({
            process: {
                env: {
                    // process.env.NODE_ENV==="production"
                    // 应用代码里，可凭此判断是否运行在生产环境
                    NODE_ENV: JSON.stringify('production')
                }
            }
        }),
        // 指定公共 bundle 的名称。
        new webpack.optimize.CommonsChunkPlugin({
            name: "chunk",
            // filename: "vendor.js"
            // (给 chunk 一个不同的名字)

            minChunks: Infinity,
            // (随着 entry chunk 越来越多，
            // 这个配置保证没其它的模块会打包进 vendor chunk)




        }),

        // 单独打包输出第三方组件，和webpack生成的运行时代码
        // new webpack.optimize.CommonsChunkPlugin({
        //     name: ['vendor', 'manifest']
        // }),

        // 修复webpack的chunkhash不以chunk文件实际内容为准的问题
        new WebpackMd5Hash(),

        // 先清理输出目录
        isDev ? null : new CleanWebpackPlugin([path.join(__dirname, 'dist')]),

        // 排除特定库
        // isDev ? null : new webpack.IgnorePlugin(/.*/, /react-hot-loader$/),

    ],
    resolve: {
        alias: {
            'redux-devtools': path.join(__dirname, '..', '..', 'src'),
            'react': path.join(__dirname, 'node_modules', 'react')
        }
    },
    resolveLoader: {
        'modules': [path.join(__dirname, 'node_modules')]
    },


    devServer: {
        hot: true,
        host: 'localhost',
        port: 80,
        contentBase: './dist', // 本地服务器所加载的页面所在的目录
    }
};

