const TerserPlugin = require('terser-webpack-plugin');
// const StyleLintPlugin = require('stylelint-webpack-plugin');
const path = require('path');

function resolve(dir) {
  return path.join(__dirname, dir);
}

const isPro = process.env.NODE_ENV === 'production';
const isH5Compiler = process.env.UNI_PLATFORM === 'h5';
const isWXCompiler = process.env.UNI_PLATFORM === 'mp-weixin';

module.exports = {
  assetsDir: 'assets',
  // 通过 Babel 显式转译一个依赖
  transpileDependencies: [],
  lintOnSave: !isPro,
  chainWebpack: (config) => {
    config.resolve.alias
      .set('@', resolve('src'));
  },
  configureWebpack: config => {
    // config.plugins = [
    //   ...config.plugins,
    //   new StyleLintPlugin({
    //     files: ['**/*.{vue,scss,css}'],
    //   }),
    // ];
    // 如果不是 H5，则不进行其它的优化打包操作。避免打包后缺少文件出错
    // 如果没有这个判断，小程序打包后缺少runtime.js等文件会出错
    if (isH5Compiler) {
      config.optimization = {
        minimizer: [
          new TerserPlugin({
            terserOptions: {
              warnings: false,
              compress: {
                drop_debugger: isPro,
                drop_console: isPro,
              },
              sourceMap: !isPro,
              cache: true,
              parallel: true,
            },
          }),
        ],
        splitChunks: {
          cacheGroups: {
            vendors: {
              name: 'chunk-vendors',
              priority: 10,
              chunks: 'all',
              test: /[\\/]node_modules[\\/](vue|vuex|vue-i18n|@dcloudio\/uni-h5)[\\/]/,
              enforce: true,
            },
            // https://github.com/webpack-contrib/mini-css-extract-plugin/issues/113
            // mini-css-extract-plugin Conflicting order problem
            default: false,
            common: false,
          },
        },
      };
    }
    // 微信小程序在开发阶段也压缩代码，减少代码大小，争取在开发调试阶段可直接预览
    if (isWXCompiler && !isPro) {
      return {
        optimization: {
          minimize: true,
        },
        // https://webpack.docschina.org/configuration/devtool/ 避免开发环境打包出来eval在微信小程序中无法运行
        devtool: 'source-map',
      };
    }
  },
  // https://webpack.docschina.org/configuration/dev-server
  devServer: {
    // port: 8080,
    // 代理请求
    // 更多代理设置请看：https://github.com/chimurai/http-proxy-middleware#options
    proxy: {
      '/api': {
        target: 'https://dq.comsenz-service.com',
        changeOrigin: true,
        ws: true,
        pathRewrite: {
          '^/api': '',
        },
      },
    },
  },
};
