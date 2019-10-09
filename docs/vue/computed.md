# Vue 的计算属性

核心实现：
1. 先实现`$data`的双向绑定
2. 调用computed对象的getter方法
3. 触发 对应$data 的getter方法
4. 将  对应$data 的观察者push到 computed对象的 Watcher 中