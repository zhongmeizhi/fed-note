# webpack环境检测

> DefinePlugin能够自动检测环境变化，效率高效。

在前端开发中，在不同的应用环境中，需要不同的配置。如：开发环境的API Mocker、测试流程中的数据伪造、打印调试信息。

如果使用人工处理这些配置信息，不仅麻烦，而且容易出错。

### 使用`DefinePlugin`配置的全局常量

注意，因为这个插件直接执行文本替换，给定的值必须包含字符串本身内的实际引号。通常，有两种方式来达到这个效果，使用 `' "production" '`, 或者使用 `JSON.stringify('production')`。

```
    new webpack.DefinePlugin({

        // 当然，在运行node服务器的时候就应该按环境来配置文件
        // 下面模拟的测试环境运行配置

        'process.env':JSON.stringify('dev'),
        WP_CONF: JSON.stringify('dev'),
    }),
```

### 测试`DefinePlugin`

编写

```
    if (WP_CONF === 'dev') {
        console.log('This is dev');
    } else {
        console.log('This is prod');
    }
```

打包后`WP_CONF === 'dev'`会便宜为`false`

```
    if (false) {
        console.log('This is dev');
    } else {
        console.log('This is prod');
    }
```

### 清除不可达代码

当使用了`DefinePlugin`插件后，打包后的代码会有很多冗余。可以通过`UglifyJsPlugin`**清除不可达代码**。

```
    [
        new UglifyJsPlugin({
            uglifyOptions: {
            compress: {
                warnings: false, // 去除warning警告
                dead_code: true, // 去除不可达代码
            },
            warnings: false
            }
        })
    ]
```

最后的打包打包代码会变成`console.log('This is prod')`


附Uglify文档：https://github.com/mishoo/UglifyJS2


### [返回主页](/README.md)
