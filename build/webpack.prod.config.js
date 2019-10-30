const path = require("path");
const webpackConfigBase = require("./webpack.base.config");
const CleanWebpackPlugin = require('clean-webpack-plugin'); // 删除指定目录模块
const merge = require("webpack-merge");
const UglifyjsWebpackPlugin = require("uglifyjs-webpack-plugin");       // 代码压缩
const optimizeCss = require("optimize-css-assets-webpack-plugin");      // css提取

const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;   // 生成依赖图工具
// const CompressionPlugin = require('compression-webpack-plugin');             // gz压缩

const webpackConfigProd = {
    mode: "production",
    plugins: [
        new CleanWebpackPlugin(["dist"], {              // 此处配置根目录
            root: path.resolve(__dirname, '../'),       // 根目录
            verbose:  true,        　　　　　　　　　　   // 开启在控制台输出信息
        }), 
        new optimizeCss(),
        new BundleAnalyzerPlugin(),
        // new CompressionPlugin({
        //     deleteOriginalAssets: true,
        //     filename: '[path].gz[query]',
        //     algorithm: 'gzip',
        //     test: new RegExp(
        //         '\\.(js|css)$'    //压缩 js 与 css
        //     )
        // })
    ],
    externals: {
        // vue: 'vue'
    },
    optimization: {
        splitChunks: {
            cacheGroups: {
                vendor:{                                        // node_modules内的依赖库
                    chunks:"all",
                    test: /[\\/]node_modules[\\/]/,
                    name:"vendor",
                    minChunks: 1,                               // 被不同entry引用次数(import),1次的话没必要提取
                    maxInitialRequests: 5,
                    minSize: 10240,
                    priority: 100
                },
                common: {                                       // ‘src/assets/js’ 下的js文件
                    chunks:"all",
                    test:/[\\/]src[\\/]assets[\\/]js[\\/]/,     // 也可以值文件/[\\/]src[\\/]js[\\/].*\.js/,  
                    name: "common",                             // 生成文件名，依据output规则
                    minChunks: 2,
                    maxInitialRequests: 5,
                    minSize: 0,
                    priority:1
                }
            }
        },
        minimizer: [
            new UglifyjsWebpackPlugin({
                exclude: /\.min\.js$/,
                cache: true,
                parallel: true,
                sourceMap: false,
                extractComments: false,
                uglifyOptions: {
                    compress: {
                        unused: true,
                        warnings: false,
                        drop_debugger: true
                    },
                    output: {
                        comments: false
                    }
                }
            })
        ]
    }
};
module.exports = merge(webpackConfigBase, webpackConfigProd);