# 防抖&节流

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
