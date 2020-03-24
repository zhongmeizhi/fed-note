# koa2

## koa2 简介

koa 和 koa2 的比较
1. `koa1` 使用 `co.js` 处理 `generator`。
2. `koa2` 使用 `async` 和 `await`，（node v7.6.0 才支持 async/await）

只提供了： context，request，response 以及 async/await 的中间件容器

简单的 koa2 中间件使用

```js
const Koa = require('koa') // koa v2
const loggerAsync  = require('./middleware/logger-async')
const app = new Koa()

function log( ctx ) {
    console.log( ctx.method, ctx.header.host + ctx.url )
}

function loggerAsync () {
  return async function ( ctx, next ) {
    log(ctx);
    await next()
  }
}

app.use(loggerAsync())

app.use(( ctx ) => {
    ctx.body = `hello ${ctx.request.url}`
})

app.listen(3000)
```

## 路由


