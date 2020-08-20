const path = require('path')
const HTMLWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin') //минификация css
const TerserWebpackPlugin = require('terser-webpack-plugin')//минификация js
// const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')

const isDev = process.env.NODE_ENV === 'development'
const isProd = !isDev
console.log('IS DEV: ', isDev)

const filename = ext => isDev ? `[name].${ext}` : `[name].[hash].${ext}`

const optimization = () => {
  const config =  {
    splitChunks: {
      chunks: "all" // отменяет дублирование одинаковых подключенных библиотек в разных js модулях
    }
  }
  if (isProd) {
    config.minimizer = [
      new OptimizeCssAssetsWebpackPlugin(),
      new TerserWebpackPlugin()
    ]
  }
  return config
}

const jsLoaders = () => {
  const loaders =  [{
    loader: 'babel-loader',
    options: {
      presets: [
        '@babel/preset-env'
      ],
      plugins: [
        '@babel/plugin-proposal-class-properties'
      ]
    }
  }]
  // if (isDev) {
  //   loaders.push('eslint-loader')
  // }
  return loaders
}

const plugins = () => {
  const base = [
    new HTMLWebpackPlugin({
      template: './index.html',
      collapseWhitespace: isProd // минификация html
    }), // генерирует index.html с подключенными js-скриптами
    new CleanWebpackPlugin(), // очищает dist от дублирующихся файлов с разным хеш
    new CopyWebpackPlugin({
      patterns: [
        { from: path.resolve(__dirname, 'src/favicon.ico'),
          to: path.resolve(__dirname, 'dist') }
      ]
    }),
    new MiniCssExtractPlugin({
      filename: filename('css') // для замены закешированных файлов в браузере на production
    }),
  ]
  if (isProd) {
    base.push(new BundleAnalyzerPlugin())
  }
  return base
}

module.exports = {
  context: path.resolve(__dirname, 'src'),
  mode: 'development',
  entry: {
    main: ['@babel/polyfill', './index.js'], // @babel/polyfill - для поддержки современного синтаксиса js не вошедшего в стандарт
    analytics_custom: './analytics.js',
  },
  output: {
    filename: filename('js'),
    path: path.resolve(__dirname, 'dist')
  },
  resolve: {
    extensions: ['.js', '.json'], // дефолтное значение расширения в строке import, если оно остуствует
    alias: {
      '@models': path.resolve(__dirname, 'src/models'),
      '@': path.resolve(__dirname, 'src')
    }
  },
  optimization: optimization(),
  devServer: {
    port: 4200,
    hot: isDev
  },
  devtool: isDev ? 'source-map' : '',
  plugins: plugins(),
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [ {
          loader: MiniCssExtractPlugin.loader,
          options: {
            hmr: isDev, // hot module replacement - замена модулей без перезагрузки страницы для dev режима
          }
        }, 'css-loader'] //style-loader добавляет сгенерированный css в <header> -> <style>
        // css-loader - интерпретирует импорты сss в импорты js
        // MiniCssExtractPlugin.loader - соединяет все стили в один файл и подключает их
      },
      {
        test: /\.(scss|sass)$/,
        use: [ {
          loader: MiniCssExtractPlugin.loader,
          options: {
            hmr: isDev, // hot module replacement - замена модулей без перезагрузки страницы для dev режима
          }
        }, 'css-loader', 'sass-loader'] //style-loader добавляет сгенерированный css в <header> -> <style>
        // css-loader - интерпретирует импорты сss в импорты js
        // MiniCssExtractPlugin.loader - соединяет все стили в один файл и подключает их
      },
      {
        test: /\.(png|jper|gif)$/,
        use: ['file-loader']
      },
      {
        test: /\.(ttf|woff|eot)$/,
        use: ['file-loader']
      },
      { test: /\.js$/,
        exclude: /node_modules/,
        use: jsLoaders(),
      }
    ]
  }
}