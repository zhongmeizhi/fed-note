# 性能优化

### 开启 ETag + Gzip

最重要的优化：使用 `oss` + `ETag` + `Gzip`

推荐插件：`gulp-oss-sync`， oss 自带 ETag + Gzip

ngnix 也有 Gzip的功能

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
* defer 是有序的，`script.js` 的执行要在所有元素解析完成之后，`DOMContentLoaded` 事件触发之前完成。
  * Mobile淘宝网，在body中script 同时有 async 和 defer
  * `DOMContentLoaded` 表示 `dom` 加载并解析完成

### H5预渲染（prerender）
* HTTPS页面 不可用 -.-!


### 网页性能查看

推荐：
1. Chrome -> 下载`Lighthouse`插件
2. 通过控制台的 `Audits` 使用 `Lighthouse`
3. 得到性能报告



### 千/万条列表更新方法

参考 [vue-virtual-scroller](https://github.com/Akryum/vue-virtual-scroller)

源码分析：
1. 根据 `props item-size` 计算滚动高度
2. 通过 `transform: translate` + `touchMove` 只做虚拟滚动
3. 通过计算 `startIndex` 和 `endIndex` 计算 `translate` 的值

总结：
* 该库的滚动实现利用 减少DOM的使用，通过计算来只做一个虚拟滚动
* 但是该库太过于依赖 props传的 `item-size` 或 `sizeField` 计算高度

构思：
*  如果要实现一个动态高度的虚拟滚动，是否可以通过前后添加预期DOM来计算即将渲染的DOM的高度，从而摆脱`props`的依赖？


## 防抖&节流

节流（throttle）：是将函数多次调用变成每隔一段时间执行（比如在onresize时调用的函数）。

防抖（debounce）：用来解决一些函数多次调用的问题（例如：一个实时搜索功能），需要加以限制。

### 延迟执行的防抖函数

只在最后一次触发时，执行目标函数。
```
const debounce = (func, wait = 500) => {
  let timer = 0
  return function(...args) {

    // 如果500ms再次触发，那么就将定时器重置

    if (timer) clearTimeout(timer);

    timer = setTimeout(() => {
      func.apply(this, args)
    }, wait)
  }
}
```

如果是发送请求的按钮。那么应该使用立即执行的防抖函数

### lodash带有立即执行选项的防抖函数：

```
function debounce (func, wait = 500, immediate = true) {
  let timer, context, args

  // 延迟执行函数
  const later = () => setTimeout(() => {
    // 内存清理
    timer = null

    if (!immediate) {
      // 后执行防抖
      // 使用到之前缓存的参数和上下文
      func.apply(context, args)

      // 清理内存
      context = args = null
    }
  }, wait)

  // 这里返回的函数是每次实际调用的函数
  return function(...params) {
    if (!timer) {
      // 如果没有setTimeout，就创建一个
      timer = later()

      if (immediate) {
        // 立即执行的防抖函数
        func.apply(this, params)
      } else {
        // 后执行的防抖函数
        // 缓存参数和调用上下文
        context = this
        args = params
      }
      
    } else {
      // 如果有setTimeout，那么重新计时
      clearTimeout(timer)
      timer = later()
    }
  }
}
```

### 节流函数


比较缓存时间和当前时间是否在时间间隔外

underscore的节流函数源码实现
```
_.throttle = function(func, wait, options) {
  
  // options选项
  // 如果想忽略开始函数的的调用，传入{leading: false}
  // 如果想忽略结尾函数的调用，传入{trailing: false}

  var context, args, result;
  var timeout = null;

  // 缓存上次调用时间
  var previous = 0;

  // 如果 options 没传则设为空对象
  if (!options) options = {};

  // 定时器回调函数
  var later = function() {

    // 如果设置了 leading（忽略开始函数），就将 previous 设为 0
    previous = options.leading === false ? 0 : _.now();

    // 置空一是为了防止内存泄漏，二是为了下面的定时器判断
    timeout = null;
    result = func.apply(context, args);
    if (!timeout) context = args = null;

  };

  return function() {

    // 获得当前时间戳
    var now = _.now();

    // 首次进入：因为previous=0，所以，如果不设置忽略开始函数
    // 那么 previous = now
    if (!previous && options.leading === false) previous = now;

    // 计算剩余时间
    var remaining = wait - (now - previous);

    context = this;
    args = arguments;
    
    if (remaining <= 0 || remaining > wait) {
      // 如果当前调用已经大于上次调用时间+wait。（已过时间间隔）
      // 或者用户手动调了时间

      // 如果存在定时器就清理掉
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }

      // 缓存时间
      previous = now;
      result = func.apply(context, args);

      // 清理内存
      if (!timeout) context = args = null;

    } else if (!timeout && options.trailing !== false) {
      // 开始或者结尾时调用的函数

      // 开始调用时: remaining = wait
      // 最后调用时：remaining = 距离wait时间
      timeout = setTimeout(later, remaining); 
    }

    return result;
  };
};
```
