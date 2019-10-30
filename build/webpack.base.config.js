const path = require('path');       // node路径模块
const HTMLWebpackPlugin = require('html-webpack-plugin');   // HTML导出模块
const config = require('../config/pages.config');                   // 多页面配置文件
const VueLoaderPlugin = require('vue-loader/lib/plugin');   // vue解析模块
const MiniCssExtractPlugin = require("mini-css-extract-plugin") ;   // css提取模块

let HTMLPlugins = [];
let Entries = {};
 
config.HTMLDirs.forEach(item => {
  const htmlPlugin = new HTMLWebpackPlugin({
    title: item.title, // 生成的html页面的标题
    filename: `${item.page}.html`, // 生成到dist目录下的html文件名称，支持多级目录（eg: `${item.page}/index.html`）
    template: path.resolve(__dirname, `../template/index.html`), // 模板文件，不同入口可以根据需要设置不同模板
    chunks: [item.page, 'vendor', 'common'], // html文件中需要要引入的js模块，这里的 vendor 是webpack默认配置下抽离的公共模块的名称
    minify: {
        collapseWhitespace: true,    // 压缩空白
        removeAttributeQuotes: true  // 删除属性双引号
    }
  });
  HTMLPlugins.push(htmlPlugin);
  Entries[item.page] = path.resolve(__dirname, `../src/pages/${item.page}/index.js`); // 根据配置设置入口js文件
});

module.exports = {
    entry: Entries, // 多入口
    output: {
        filename: 'js/[name].[hash:8].js',
        path: path.resolve(__dirname, '../dist'),
        publicPath: ''
    },
    resolve: {
        extensions: ['.js', '.vue', '.json']
    },
    externals: {
        // 'mui': 'mui'
    },
    plugins: [
        new VueLoaderPlugin(),  // vue解析器
        new MiniCssExtractPlugin({ // 提取样式到单独的文件中
            filename: "css/[name].[hash:8].css",
            chunkFilename: "[id].css"
        }),
        ...HTMLPlugins  // 多页面输出
    ],
    module: {
        rules: [
            {
                test: /\.vue$/,
                exclude: /node_modules/,
                use: ['vue-loader']
            },
            {
                test: /\.css$/,
                exclude: /node_modules/,
                include: path.join(__dirname, '../src'),
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader, // 提取less为单独的样式文件\
                        options: {
                            publicPath: '../'
                        }
                    }, 
                    'style-loader', 
                    'css-loader',
                    'postcss-loader'
                ]
            },
            {
                test:/\.less$/,
                exclude: /node_modules/,
                include: path.join(__dirname, '../src'),
                use:[
                    {
                        loader: MiniCssExtractPlugin.loader, // 提取less为单独的样式文件\
                        options: {
                            publicPath: '../'
                        }
                    }, 
                    'css-loader',
                    'postcss-loader',
                    'less-loader'
                ] 
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                include: [path.join(__dirname, '../src'), path.join(__dirname, '../Dom7')],
                use: [{loader:"babel-loader",
                options:{
                    presets: ['es2015']
                 }
                }]
            },
            {
                test: /\.(png|jpg|jpeg|gif)$/,
                exclude: /node_modules/,
                include: path.join(__dirname, '../src'),
                use: [{
                    loader: "url-loader",
                    options: {
                        name: '[name].[hash:7].[ext]',
                        limit: 10000, // 表示小于10kb的图片转为base64，否则为路径
                        outputPath: "images"
                    }
                },
	            {	//压缩图片要在url-loader之后使用
	            	loader:'image-webpack-loader',
                    options:{
                        bypassOnDebug: true
                    }
	            }]
            },
            {
                test: /\.(eot|svg|ttf|woff)$/,
                exclude: /node_modules/,
                include: path.join(__dirname, '../src'),
                use: [{
                    loader: "url-loader",
                    options: {
                        name: '[name].[hash:7].[ext]',
                        limit: 10000, // 表示小于10kb的图片转为base64，否则为路径
                        outputPath: "font"
                    }
                }]
            }
        ]
    },
    // 对控制台输出日志的简化
    stats: {
        modules: false, // 是否添加构建模块信息
        children: false // 是否添加 children 信息
    }

}