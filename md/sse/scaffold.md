# 搭建一个自己的前端项目

项目相关

### 搭建脚手架

案例：[https://www.npmjs.com/package/create-fv-cli](https://www.npmjs.com/package/create-fv-cli)

脚手架重点：

1. 脚手架名称不能有冲突（可以在 npm 官网查询）
2. 脚手架入口 `package.json` -> `bin`
3. 脚手架如果名称为 `create-fv-cli` 那么 `npm init fv-cli` 可以指到 `create-fv-cli` 地址。
4. 脚手架的依赖包要放在 `dependencies` 中（否则会提示没有module）

脚手架的几种思路：

1. 最好的当然是 yyx 的利用 `fs-extra` 估计目录执行 `copy`
2. 也可以使用 commander 通过 git clone 安装


### PrerenderSPAPlugin 启动预渲染

预渲染采用 vue 推荐的 `PrerenderSPAPlugin` 插件，放入 `webpack` 就可以使用

PrerenderSPAPlugin 使用

```js
  new PrerenderSPAPlugin({
    staticDir: path.join(__dirname, 'dist'),
    routes: [ '/', '/about'],
    renderer: new PrerenderSPAPlugin.PuppeteerRenderer({
      renderAfterDocumentEvent: 'render-event',
      // renderAfterTime: 5000
    })
  })
```

在 vue 文件中通过 `renderAfterDocumentEvent` 告知 `PrerenderSPAPlugin` render 时间点，当然多个 route 需要弄多个 event

```js
  document.dispatchEvent(new Event('render-active'))
```

工作流程

![prerender](/md/img/vue/prerender.png)


