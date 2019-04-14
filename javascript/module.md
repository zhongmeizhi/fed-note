# 模块化

模块化主要是用来抽离公共代码，隔离作用域，避免变量冲突等。将一个复杂的系统分解为多个模块以方便编码。

会讲述以下内容
1. CommonJS
2. AMD 及 核心原理实现
3. CMD 及 核心原理实现
4. UMD 及 源码解析
5. ES6 Module
6. webpack打包策略

### CommonJS

> 同步加载

CommonJS API是以在浏览器环境之外构建 JS 生态系统为目标而产生的项目

如果没有写后缀名Node会尝试为文件名添加.js、.json、.node后再搜索。

.js件会以文本格式的JavaScript脚本文件解析，.json文件会以JSON格式的文本文件解析，.node文件会以编译后的二进制文件解析。

### AMD

> 异步加载（对象）

"Asynchronous Module Definition"（异步模块定义），是由RequireJS提出的

AMD核心实现
```
  function require (url, callback) {
    // url可以换成List，然后遍历；
    var $script = document.createElement('script');
    $script.src = url;

    // 利用onload回调，实现依赖加载
    $script.onload = function (e) {
      // 省略callback 检测
      callback();
    }
    document.body.appendChild($script);
  }

```

### CMD

> 按需加载

由玉伯提出的（seajs），按需解析加载模块（代价挺大的），需要使用把模块变为字符串解析一遍才知道依赖了那些模块

CMD核心实现
```
  // ajax，怕忘了原生ajax怎么写。顺手写一个

  function myAjax (url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open('get', url);
    xhr.send();

    xhr.onreadystatechange = function () {
      if (request.readyState === 4) {
          if (request.status === 200) {
              return callback(request.responseText);
          } else {
              // 省略...
          }
      } else {
        // 省略...
      }
    }
  }

  // 实现
  function require(url) {
    myAjax(url, function(res) {
      // 此时 res 的对应JS的 String形式
      // 解析 省略
      // 执行
      eval(res);
    });
  }
```

### UMD

> 兼容AMD，CommonJS 模块化语法。

UMD源码解析
```
  (function (root, factory) {

    // 判断是否支持AMD（define是否存在）
    if (typeof define === 'function' && define.amd) {
        define(['b'], factory);

    // 判断是否支持NodeJS模块格式（exports是否存在）
    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory(require('b'));

    // 前两个都不存在，则将模块公开到全局（window或global）
    } else {
        root.returnExports = factory(root.b);
    }
  } (this, function (b) {
      // ...
  }));
```

### import

> 加载引用

* 编译时加载（静态执行）。
* 加载的是引用
* 不能处于代码块中
  - 为了实现编译时加载
	- 提案表示可以用 `import()`使用时加载
* 不能使用表达式和变量 等运行时加载的语法
  - 同上

### webpack打包策略

> import会被编译成 require/exports （CommonJS规范）

**1. 直接引入**

`import xxx.js`或者`import xxx.css`会像添加`<script>`和`<link>`标签一样注入到全局中去

**2. commonjs同步语法**

webpack会将`require('abc.js')`打包进引用它的文件中。以对象的形式获取。

**3. commonjs异步加载**

webpack(require.ensure)：webpack 2.x 版本中的代码分割。

在commonjs中有一个Modules/Async/A规范，里面定义了`require.ensure`语法。webpack实现了它，作用是可以在打包的时候进行代码分片，并异步加载分片后的代码。

此时list.js会被打包成一个单独的chunk文件。像这样：1.d6f343b727f5923508bf.js

例如：vue路由懒加载`const Foo = () => import('./Foo.vue')`

**manifest**

manifest文件是最先加载的，manifest是在vendor的基础上，再抽取出要经常变动的部分，通过manifest.js文件来管理bundle文件的运行和加载。(比如关于异步加载js模块部分的内容)

**webpack v4.6.0+ 添加了预取和预加载的支持**
```
  import(/* webpackPrefetch: true */ 'LoginModal');
  
  会生成 <link rel="prefetch" href="login-modal-chunk.js"> 并追加到页面头部
```

