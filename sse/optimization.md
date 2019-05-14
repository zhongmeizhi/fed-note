# 性能优化

### 请求优化

1. 减少请求数
    - 懒加载
    - 雪碧图
    - 合并CSS、JS
2. 减少请求量
3. 合理利用缓存
4. CDN 
5. http2 || keep-alive

### 重定向优化

* 尽可能避免 301、302 重定向
* 需要重定向时，可以把重定向之后的地址直接写到前端的html或JS中
* 可以减少客户端与服务端的通信过程，节省重定向耗时

### DNS优化

* 减少DNS的请求次数
    - 尽量把各种资源放在一个cdn域名上
* 进行DNS预获取
    - 预先加载(prefetch): 利用浏览器的空闲时间去先下载用户指定需要的内容,然后缓存起来,在用户下次加载时,就直接从缓存中取出来
    - 淘宝网案例：`<link rel="dns-prefetch" href="//g.alicdn.com">`

### 渲染优化

* 减少重绘、重排
* 防抖
* 节流

### 代码优化

* CSS放在head中
* 减少DOM操作
* 懒函数
* 减少层级访问
* 事件委托

### 单页面优化
* PWA直出
* 预加载
* 预渲染
* SSR

### 异步加载（defer 和 async）
* 都是异步加载
* 都仅适用于外部脚本
* async 优先
* async 是无序的，只要下载完毕就会立即执行。
  * PC淘宝网，head中的script 都是 async
* defer 是有序的，代码的执行按在html中的先后顺序，`script.js` 的执行要在所有元素解析完成之后，DOMContentLoaded 事件触发之前完成。
  * Mobile淘宝网，在body中script 同时有 async 和 defer

### H5预渲染（prerender）
* HTTPS页面 不可用 -.-!

### [返回主页](/README.md)