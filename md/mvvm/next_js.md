# 体验 next.js

> 玩了下[next.js](https://nextjs.frontendx.cn/docs/)，写写总结。


* 需要`xxx.js`，设置插件，如：代理插件 -> 然后调用`next`
* 使用`next.config.js`自定义webpack等配置
* 导出成 html 需要 `npm run build && next export`


## 遇到的问题


### css-loader 和 webpack版本冲突问题

> Invalid options object. CSS Loader has been initialised using an options object that does not match the API schema. - options has an unknown property 'minimize'. 

原因：在使用`zeit/next-less`时：webpack 4版本 css-loader有冲突，因为`minimize`属性在webpack4中被移除了
  * [解决方法](https://github.com/zeit/next-plugins/issues/541)

```
    // next.config.js
    const withLess = require('@zeit/next-less')

    // 解决webpack和css-loader冲突问题
    function HACK_removeMinimizeOptionFromCssLoaders(config) {
        console.warn(
            'HACK: Removing `minimize` option from `css-loader` entries in Webpack config',
        );
        config.module.rules.forEach(rule => {
            if (Array.isArray(rule.use)) {
            rule.use.forEach(u => {
                if (u.loader === 'css-loader' && u.options) {
                    delete u.options.minimize;
                }
            });
            }
        });
    }
        
    const env = process.env.NODE_ENV;

    // 使用 less
    module.exports = withLess({
    cssModules: false, // 不使用cssModules
    // CDN等静态文件地址路径
    assetPrefix:  env === 'development' ? '/' : '/abc',
    // 导出html配置
    exportPathMap: async function (defaultPathMap) {
        return {
            '/index.html': { page: '/' },
            '/xxx/index.html': { page: '/xxx' },
            '/yyy/index.html': { page: '/yyy' },
            '/zzz/index.html': { page: '/zzz' },
        }
    },
    webpack(config, options) {

        HACK_removeMinimizeOptionFromCssLoaders(config);
        
        // 修改出口文件路径
        config.output.publicPath = env === 'development' ? '/' : '/abc';

        return config
    }
    })
```

### antd-mobile 中less不能加载问题

> Inline JavaScript is not enabled. Is it set in your options?

antd-mobile包中的inputitem的less样式其中使用了带参mixin。那么**使用了mixin在less-loader中需要配置`javascriptEnabled: true`**

参考：[github issue](https://github.com/zeit/next-plugins/issues/454)

解决方案： `withLess`中添加属性` lessLoaderOptions: {javascriptEnabled: true}, `


### next-less 和 cssmodules 冲突

> Module not found: Can't resolve 'css-loader/locals'

原因： `zeit/next-less`在预渲染 bundle 中 使用 css-loader/locals 而不是 style-loader!css-loader 。它不会嵌入 CSS，但只导出标识符映射(identifier map)。

但是呢：下载也下载不了
* 然鹅把`next-less`的`cssModules: true,`删掉或者改成false就不会报错了。
* 然鹅，`zeit/next-less`又该怎么用`cssModules`?

ps：就刚好用的`9.0.7`版本有这个问题，会有这个问题，

参考： [github issue](https://github.com/zeit/next-plugins/issues/392)

解决方案：升级或者降级 `next.js` 的版本


### 解决代理问题

> 解决代理问题

配置 app.js，运行命令： `start": "cross-env NODE_ENV=development PORT=3000 node app.js`

```
    // app.js
    const express = require('express')
    const next = require('next')

    const devProxy = {
        '/abc': {
            target: 'http:/www.xxx.com/abc',
            pathRewrite: {
                '^/abc': '/'
            },
            changeOrigin: true
        }
    }

    const port = parseInt(process.env.PORT, 10) || 3000
    const env = process.env.NODE_ENV
    const dev = env !== 'production'

    // 调用next.js运行环境
    const app = next({
        dir: '.',
        dev
    })

    const handle = app.getRequestHandler()

    let server;

    app.prepare()
        .then(() => {
            server = express()

            // 设置代理
            if (dev && devProxy) {
                const proxyMiddleware = require('http-proxy-middleware');
                Object.keys(devProxy).forEach(function (context) {
                    server.use(proxyMiddleware(context, devProxy[context]))
                })
            }

            server.all('*', (req, res) => handle(req, res))

            server.listen(port, err => {
                if (err) {
                    throw err
                }
                console.log(`> Ready on port ${port} [${env}]`)
            })
        })
        .catch(err => {
            console.log('An error occurred, unable to start the server')
            console.log(err)
        })
```



