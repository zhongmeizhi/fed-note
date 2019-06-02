# 防抖

> 很多功能（例如：一个实时搜索功能）会导致函数多次调用，而每一次调用都会有很大的性能损耗，需要加以限制。

解决函数多次调用的方法之一：防抖（debounce）

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
