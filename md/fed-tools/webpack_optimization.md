# webpack 性能优化

陈列以下插件
* DllPlugin + DllReferencePlugin
* CommonsChunkPlugin
* UglifyJSPlugin
* ExtractTextPlugin + PurifyCSSPlugin
* DefinePlugin
* HappyPack
* ParallelUglifyPlugin
* BundleAnalyzerPlugin

会讲述以下配置项
  * webpack外部扩展(externals)
  * 条件匹配 test & include & exclude

### DllPlugin + DllReferencePlugin

为了极大减少构建时间，进行分离打包。

DllReferencePlugin 和 DLL插件DllPlugin 都是在_另外_的 webpack 设置中使用的。

`DllPlugin`这个插件是在一个额外的独立的 webpack 设置中创建一个只有 dll 的 bundle(dll-only-bundle)。 这个插件会生成一个名为 manifest.json 的文件，这个文件是用来让 `DLLReferencePlugin` 映射到相关的依赖上去的。

webpack.vendor.config.js

```
  new webpack.DllPlugin({
    context: __dirname,
    name: "[name]_[hash]",
    path: path.join(__dirname, "manifest.json"),
  })
```

webpack.app.config.js

```
  new webpack.DllReferencePlugin({
    context: __dirname,
    manifest: require("./manifest.json"),
    name: "./my-dll.js",
    scope: "xyz",
    sourceType: "commonjs2"
  })
```

### CommonsChunkPlugin

通过将公共模块拆出来，最终合成的文件能够在最开始的时候加载一次，便存到缓存中供后续使用。这个带来速度上的提升，因为浏览器会迅速将公共的代码从缓存中取出来，而不是每次访问一个新页面时，再去加载一个更大的文件。

如果把公共文件提取出一个文件，那么当用户访问了一个网页，加载了这个公共文件，再访问其他依赖公共文件的网页时，就直接使用文件在浏览器的缓存，这样公共文件就只用被传输一次。

```
  entry: {
    vendor: ["jquery", "other-lib"], // 明确第三方库
    app: "./entry"
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
      name: "vendor",
      // filename: "vendor.js"
      // (给 chunk 一个不同的名字)

      minChunks: Infinity,
      // (随着 entry chunk 越来越多，
      // 这个配置保证没其它的模块会打包进 vendor chunk)
    })
  ]

  // 打包后的文件
  <script src="vendor.js" charset="utf-8"></script>
  <script src="app.js" charset="utf-8"></script>
```

### UglifyJSPlugin

基本上脚手架都包含了该插件,该插件会分析JS代码语法树，理解代码的含义，从而做到去掉无效代码、去掉日志输入代码、缩短变量名等优化。

```
  const UglifyJSPlugin = require('webpack/lib/optimize/UglifyJsPlugin');
  //...
  plugins: [
      new UglifyJSPlugin({
          compress: {
              warnings: false,  //删除无用代码时不输出警告
              drop_console: true,  //删除所有console语句，可以兼容IE
              collapse_vars: true,  //内嵌已定义但只使用一次的变量
              reduce_vars: true,  //提取使用多次但没定义的静态值到变量
          },
          output: {
              beautify: false, //最紧凑的输出，不保留空格和制表符
              comments: false, //删除所有注释
          }
      })
  ]
```

### ExtractTextPlugin + PurifyCSSPlugin

ExtractTextPlugin 从 bundle 中提取文本（CSS）到单独的文件，PurifyCSSPlugin纯化CSS（其实用处没多大）

```
  module.exports = {
    module: {
      rules: [
        {
          test: /\.css$/,
          loader: ExtractTextPlugin.extract({
            fallback: 'style-loader',
            use: [
              {
                loader: 'css-loader',
                options: {
                  localIdentName: 'purify_[hash:base64:5]',
                  modules: true
                }
              }
            ]
          })
        }
      ]
    },
    plugins: [
      ...,
      new PurifyCSSPlugin({
        purifyOptions: {
          whitelist: ['*purify*']
        }
      })
    ]
  };
```

### DefinePlugin

在[webpack环境检测与优化](/md/fed-tools/define_plugin.md)篇以阐述

使用DefinePlugin区分环境 + UglifyJsPlugin清除不可达代码，以减轻打包代码体积

### HappyPack

[HappyPack](https://github.com/amireh/happypack)可以**开启多进程Loader转换**，将任务分解给多个子进程，最后将结果发给主进程。

使用
```
  exports.plugins = [
    new HappyPack({
      id: 'jsx',
      threads: 4,
      loaders: [ 'babel-loader' ]
    }),

    new HappyPack({
      id: 'styles',
      threads: 2,
      loaders: [ 'style-loader', 'css-loader', 'less-loader' ]
    })
  ];

  exports.module.rules = [
    {
      test: /\.js$/,
      use: 'happypack/loader?id=jsx'
    },

    {
      test: /\.less$/,
      use: 'happypack/loader?id=styles'
    },
  ]
```

### ParallelUglifyPlugin

[ParallelUglifyPlugin](https://github.com/gdborton/webpack-parallel-uglify-plugin)可以**开启多进程压缩JS文件**

```
  import ParallelUglifyPlugin from 'webpack-parallel-uglify-plugin';

  module.exports = {
    plugins: [
      new ParallelUglifyPlugin({
        // Optional regex, or array of regex to match file against. Only matching files get minified.
        // Defaults to /.js$/, any file ending in .js.
        test,
        include, // Optional regex, or array of regex to include in minification. Only matching files get minified.
        exclude, // Optional regex, or array of regex to exclude from minification. Matching files are not minified.
        cacheDir, // Optional absolute path to use as a cache. If not provided, caching will not be used.
        workerCount, // Optional int. Number of workers to run uglify. Defaults to num of cpus - 1 or asset count (whichever is smaller)
        sourceMap, // Optional Boolean. This slows down the compilation. Defaults to false.
        uglifyJS: {
          // These pass straight through to uglify-js@3.
          // Cannot be used with uglifyES.
          // Defaults to {} if not neither uglifyJS or uglifyES are provided.
          // You should use this option if you need to ensure es5 support. uglify-js will produce an error message
          // if it comes across any es6 code that it can't parse.
        },
        uglifyES: {
          // These pass straight through to uglify-es.
          // Cannot be used with uglifyJS.
          // uglify-es is a version of uglify that understands newer es6 syntax. You should use this option if the
          // files that you're minifying do not need to run in older browsers/versions of node.
        }
      }),
    ],
  };
```

### BundleAnalyzerPlugin

webpack打包结果分析插件

```
  const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
 
  module.exports = {
    plugins: [
      new BundleAnalyzerPlugin()
    ]
  }
```

### 外部扩展(externals)

这玩意不是插件，是wenpack的配置选项

externals 配置选项提供了「从输出的 bundle 中排除依赖」的方法。相反，所创建的 bundle 依赖于那些存在于用户环境(consumer's environment)中的依赖。此功能通常对 library 开发人员来说是最有用的，然而也会有各种各样的应用程序用到它。


```
  entry: {
    entry: './src/main.js',
    vendor: ['vue', 'vue-router', 'vuex']
  },
  externals: {
    // 从输出的 bundle 中排除 echarts 依赖
    echarts: 'echarts',
  }
```

### test & include & exclude

减小文件搜索范围，从而提升速度

示例
```
  {
    test: /\.css$/,
    include: [
      path.resolve(__dirname, "app/styles"),
      path.resolve(__dirname, "vendor/styles")
    ]
  }
```