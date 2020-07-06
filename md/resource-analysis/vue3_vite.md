# vite

最容易搭建 `vue3` 的方式就是使用作者的 [vite](https://github.com/vitejs/vite)

通过 `npm` 安装

```
  $ npm init vite-app <project-name>
  $ cd <project-name>
  $ npm install
  $ npm run dev
```

也可以通过 `yarn` 安装

```
  $ yarn create vite-app <project-name>
  $ cd <project-name>
  $ yarn
  $ yarn dev
```

安装的过程中你可能遇到以下问题（反正本菜遇到了） 

* 异常1：`No valid exports main found for' C:\xxx\xxx\node_ modules\@rollup\pluginutils'`
* 异常2：`The engine "node" is incompatible with this module. Expected version ">= 10.16.0". Got "10.15.3`

异常1：本菜翻阅了 `vite` 的 issue，然后 google + baidu 一无所获， 最后发现是因为本菜 `node` 版本为 `13.5.0`导致的（版本过高），

异常2：很明显啦，`node` 版本太低了。

最后的解决方式是：本菜通过 `nvm` 将 node 版本切换到 `12.12.0`，至于 `nvm` 没使用过的童鞋们可以去尝试下哦。特别好用


### vite 原理解析

当浏览器识别 `type="module"` 引入js文件的时候，内部的 import 就会发起一个网络请求，尝试去获取这个文件。

那么就可以通过通过拦截路由 `/` 和 `.js` 结尾的请求。然后通过 node 去加载对应的 `.js` 文件

```js
    const fs = require('fs')
    const path = require('path')
    const Koa = require('koa')
    const app = new Koa()

    app.use(async ctx=>{
        const {request:{url} } = ctx
        // 首页
        if(url=='/'){n
            ctx.type="text/html"
            ctx.body = fs.readFileSync('./index.html','utf-8')
        }else if(url.endsWith('.js')){
            // js文件
            const p = path.resolve(__dirname,url.slice(1))
            ctx.type = 'application/javascript'
            const content = fs.readFileSync(p,'utf-8')
            ctx.body = content
        }
    })

    app.listen(3001, ()=>{
        console.log('听我口令，3001端口，起~~')
        // 大圣老湿是真的皮哇。
    })
```

如果只是简单的代码，这样加载就可以了。完全是按需加载，比起 webpack 的语法解析性能当然会快非常多。

但是遇到第三方库以上代码就会找不到 `.js` 文件的位置了，此时 `vite` 会用 `es-module-lexer` 把文件解析成 `ast`，拿到 `import` 的地址。

通过分析 `import` 的内容，识别是不是第三方库（这个主要是看前面是不是相对路径）

如果是第三方库就去 `node_modules` 中查找，`vite` 中通过在第三方库中添加前缀 `/@modules/`，然后发现了 `/@modules/` 后走 `第三方库逻辑`

```js
    if(url.startsWith('/@modules/')){
        // 这是一个node_module里的东西
        const prefix = path.resolve(__dirname,'node_modules',url.replace('/@modules/',''))
        const module = require(prefix+'/package.json').module
        const p = path.resolve(prefix,module)
        const ret = fs.readFileSync(p,'utf-8')
        ctx.type = 'application/javascript'
        ctx.body = rewriteImport(ret)
    }
```

这样第三方库也可以解析了。然后是 `.vue` 单文件解析。

首先 `xx.vue` 返回的格式大概是这样的

```js
const __script = {
    setup() {
        ...
    }
}
import {render as __render} from "/src/App.vue?type=template&t=1592389791757"
__script.render = __render
export default __script
```

然后可以用 `@vue/compiler-dom` 把 `html` 解析成 `render`

解析 `.css` 就更加简单了。通过 `document.createElement('style')` 然后再注入就好了

[参考-大圣 的知乎文章](https://zhuanlan.zhihu.com/p/149033579)

ps：具体的源码还没看（先搞点 Vue3 吧）