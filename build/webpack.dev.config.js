const path = require("path");
const merge = require("webpack-merge");
const webpackConfigBase = require("./webpack.base.config");

const webpackConfigDev = {
    devtool: 'cheap-module-eval-source-map', // 指定加source-map的方式
    mode: 'development',
    devServer:{
        // 设置服务器访问的基本目录
        contentBase: path.resolve(__dirname,'../dist'), //最好设置成绝对路径
        // 设置服务器的ip地址,可以是localhost
        host: '192.168.60.111',
        // 设置端口
        port: 8090,
        
        // 设置自动拉起浏览器
        open: false,
        // 代理
        proxy: {
            '/**': {
//              target: 'https://dltapp.x2x.net',
                target: 'http://47.75.210.180',
                // target: 'http://124.232.133.207:8950',
                changeOrigin: true,  
                secure: false
            }
        }
    },
    watch: true, // 开启监听文件更改，自动刷新
    watchOptions: {
        ignored: /node_modules/, // 忽略不用监听变更的目录
        aggregateTimeout: 500, // 防止重复保存频繁重新编译,500毫米内重复保存不打包
        poll:1000 // 每秒询问的文件变更的次数
    }
}
module.exports = merge(webpackConfigBase, webpackConfigDev);