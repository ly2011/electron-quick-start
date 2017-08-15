const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const baseConfig = require('./webpack.base');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
// const DashboardPlugin = require('webpack-dashboard/plugin');
const CommonsChunkPlugin = webpack.optimize.CommonsChunkPlugin;
// const OfflinePlugin = require('offline-plugin');
function resolve(dir = '.') {
  return path.join(__dirname, '..', dir);
}
/**
 * 目录/路径
 */
const appPath = resolve('app');
const buildPath = resolve('dist');
const faviconPath = resolve('app/assets/favicon.ico');

const developmentConf = merge(baseConfig, {
  entry: {
    index: resolve('app/index.js')
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(
        process.env.NODE_ENV || 'development'
      )
    }),
    new webpack.HotModuleReplacementPlugin(),
    new FriendlyErrorsWebpackPlugin(),
    // new DashboardPlugin(),
    // new OfflinePlugin({   externals: ['index.html'],   AppCache: false, }), //
    // pwa
    new HtmlWebpackPlugin({
      // 根据模板插入css/js等生成最终HTML
      title: 'electron',
      // favicon: faviconPath, // favicon路径
      filename: 'index.html',
      template: resolve('app/index.html'),
      hash: false,
      // excludeChunks: 'appcache/manifest.appcache',
      inject: true,
      minify: {
        removeComments: true, // 移除HTML中的注释
        collapseWhitespace: true, // 删除空白符与换行符
        removeAttributeQuotes: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true
        // more options: https://github.com/kangax/html-minifier#options-quick-reference
      },
      cache: false,
      // necessary to consistently work with multiple chunks via CommonsChunkPlugin
      chunksSortMode: 'dependency'
    }),
    new CommonsChunkPlugin({
      // name: ['mainifest'], // 将公共模块提取, 参照 entry
      name: ['vendor', 'mainifest'], // 将公共模块提取, 参照 entry
      minChunks: Infinity // 提取所有entry共同依赖的模块
    }),
    // copy static
    new CopyWebpackPlugin([
      { from: `${appPath}/main.js`, to: `${buildPath}/main.js` },
      { from: `${appPath}/renderer.js`, to: `${buildPath}/renderer.js` },
      {
        from: `${appPath}/static`,
        to: `${buildPath}/static`,
        ignore: ['.*']
      }
    ])
    // new ExtractTextPlugin('css/[name].[hash].css')
  ],
  devtool: 'cheap-module-eval-source-map',
  devServer: {
    contentBase: appPath,
    watchContentBase: true, // 文件更改将触发整个页面重新加载。
    inline: true, // 实时刷新
    hot: true,
    port: 8080,
    host: '0.0.0.0',
    hotOnly: true, // 在构建失败的情况下，启用热模块替换（请参阅devServer.hot）而不刷新页面作为回退。
    // clientLogLevel: 'info', //devtool控制台显示信息 none, info, (warning,error 一直有）
    lazy: false, // 延迟编译，对于异步模块，只有在请求时才会编译，在生产中不需要
    filename: 'bundle.js',
    headers: {
      // 为所有请求添加请求头
      'X-Custom-Foo': 'bar'
    },
    proxy: {
      // 如果不用pathrewrite，目标地址后面不能跟接口名字
      '/api': {
        target: 'http://tj.nineton.cn/Heart/index',
        changeOrigin: true,
        secure: false
      },
      '/notes': {
        target: 'http://www.jianshu.com/notes',
        changeOrigin: true,
        secure: false,
        pathRewrite: {
          '^/notes': '/notes'
        }
      }
    },
    historyApiFallback: true, // 使用HTML5 History API时，系统可能会发送index.html网页来取代404回应
    https: false, // 使用https协议
    noInfo: false, // 隐藏webpack打包时的信息
    quiet: false, // 启用安静功能后，除了初始启动信息之外的任何内容都将写入控制台。这也意味着来自webpack的错误或警告不可见。
    compress: true,
    stats: {
      assets: true,
      children: false,
      chunks: false,
      hash: false,
      modules: false,
      publicPath: false,
      timings: true,
      version: true,
      warnings: true,
      colors: {
        green: '\u001b[32m'
      }
    }
  }
});

module.exports = developmentConf;
