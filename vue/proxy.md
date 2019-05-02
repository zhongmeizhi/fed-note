# Vue 源码实现

> Vue的双向绑定是`利用订阅-发布者模式`+`数据劫持`实现的

双向绑定实现原理图：
![vue双向绑定](/img/vue_proxy.png)


```

```

**注意点：**
* Vue在初始化组件数据(data、props、computed、methods、events、watch)时，发生在create时期（beforeCreate与created之间）
* render(渲染)触发的是Data的getter操作（保证视图中用到的数据改变才触发后续的重新渲染）
* Vue2.0的数据劫持`Object.defineProperty`方法是无法监听`Array`变化的
  * 尤大使用了hack手法，重写了['push', 'pop', 'shift', 'unshift', 'splice', 'sort', 'reverse']，
  * 同时使用`const arrayMethods = Object.create(arrayProto)`确保不污染原生数组方法