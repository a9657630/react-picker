const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin'); // 动态生成html
const ExtractTextPlugin = require('extract-text-webpack-plugin'); // css单独打包
const CleanWebpackPlugin = require('clean-webpack-plugin'); // 清理build文件夹
const autoprefixer = require('autoprefixer');

module.exports = {
  // 类型: 'source-map', 'cheap-module-source-map', 'eval-source-map', 'cheap-module-eval-source-map'
  // 开发环境: cheap-module-eval-source-map
  // 生产环境: cheap-module-source-map
  // devtool: 'cheap-module-eval-source-map',
  entry: {
    main: `${__dirname}/example/index.js`,
    vendor: ['react'],
  },
  output: {
    path: `${__dirname}/build`,
    filename: '[name].js',
    chunkFilename: '[name].js',
  },
  module: {
    rules: [
      {
        test: /\.(png|jpg)$/,
        use: 'url-loader?limit=8192&name=images/[hash:10].[ext]',
        exclude: /^node_modules$/,
        // include: `${__dirname}/src/`,
      },
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          allChunks: true,
          use: 'css-loader',
        }),
      },
      {
        // test: /style\.less/,
        test: /\.less$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          allChunks: true,
          // use: ['css-loader', 'postcss-loader', 'less-loader'],
          use: ['css-loader', {
            loader: 'postcss-loader',
            options: {
              plugins: () => [autoprefixer],
            },
          }, 'less-loader'],
        }),
        exclude: /^node_modules$/,
        // include: `${__dirname}/src/`,
      },
      {
        test: /\.jsx?$/,
        use: {
          loader: 'babel-loader',
          query: {
            presets: ['env', 'react'],
          },
        },
        exclude: /node_modules/,
        // include: `${__dirname}/example/`,
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx', '.css', 'json', 'less'], // import时, 可以隐藏后缀
  },
  plugins: [
    new webpack.optimize.LimitChunkCountPlugin({ maxChunks: 15 }),
    new webpack.optimize.MinChunkSizePlugin({ minChunkSize: 10000 }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.optimize.CommonsChunkPlugin({ // 提取第三方库, filename在output里设置
      name: 'vendor',
      minChunks: module => (
        module.context && module.context.indexOf('node_modules') !== -1 // 只提取node_modules中的库
      ),
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'manifest',
      minChunks: Infinity, // 无穷大
    }),
    new HtmlWebpackPlugin({ template: `${__dirname}/example/index.html` }),
    new CleanWebpackPlugin(['build'], { // 清理build文件夹
      root: __dirname,
      verbose: true,
      dry: false,
    }),
    // new webpack.ProvidePlugin({
    //   humane: 'humane-js',
    // }),
    new ExtractTextPlugin({ // css输出文件名 webpack2语法
      filename: '[name].css',
      allChunks: true,
    }),
  ],
};
