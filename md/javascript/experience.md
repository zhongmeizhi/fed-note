# 经验之谈

### 名词解释

* OOP：面向对象编程（Object Oriented Programming）（Oriented = 导向的）
* RP：响应式编程（Reactive Programming）（reactive = 响应的）
* FP：函数式编程（Functional Programming）
* AOT: 运行前编译（Ahead Of Time）
* JIT：运行时编译（Just-in-time）
* BOM：浏览器对象模型（Browser Object Model）（BOM的最核心对象是window对象）
* DOM：文档对象模型（Document Object Model）DOM的最根本对象是 window.document
* 静态作用域： 变量的作用域在写代码的时候就确定过了（JS和Dart都是静态作用域）
* 堆栈：基本数据类型的变量存储在栈中，引用数据类型的变量存储在堆中，引用类型数据的地址也存在栈中

### 面向对象的特性

三大基础特性
1. 封装
    * 把客观事物封装成抽象的类，类就是封装了属性和操作方法的逻辑实体
2. 继承
    * 可以让某个类型的对象获得另一个类型的对象的属性的方法
3. 多态
    * 一个类实例的相同方法在不同情形有不同表现形式

五大基本原则
1. 单一职责原则
2. 开放封闭原则
3. 替换原则
4. 依赖原则
5. 接口分离原则

### Vue $route.query 多个相同参数问题

在 vue 中, 如果在 hash 的 query 中有2个参数 ?a=1&a=2

此时
```js
const { a } = this.$route.query;

console.log(a); // [1, 2]
```

### Vue style scope 不生效问题

问题：

在 `.vue` 文件中，使用以下代码

```css
<style  scoped>
    @import "./abc.css";
</style>
```

产生结果 `.abc.css` 依然是全局的

解决方案：通过 `less` 预处理一下。

```css
<style lang="less" scoped>
    @import "./abc.less";
</style>
```

或者直接在 `src="./abc.less" scoped`

### 处理精确度问题

> JS的精确度。。。

* 0.1 + 0.2 => 0.30000000000000004
* 0.105.toFixed(2) = 0.1 // not 0.11

解决方案：(参考 [number-precision](https://github.com/nefe/number-precision))
```
    // 1. 获得小数点后位数 * 10
    // 2. *对应10 转换成整数 / 对应10

    function add(num1, num2) {
        const num1Digits = (num1.toString().split('.')[1] || '').length;
        const num2Digits = (num2.toString().split('.')[1] || '').length;
        const baseNum = Math.pow(10, Math.max(num1Digits, num2Digits));
        return (num1 * baseNum + num2 * baseNum) / baseNum;
    }
```

### moment.js / day.js 主要思想

1. 列出 时间Map

例如`day.js`
```js
    const matches = {
        YY: String(this.$y).slice(-2),
        YYYY: this.$y,
        M: $M + 1,
        MM: Utils.s($M + 1, 2, '0'),
        MMM: getShort(locale.monthsShort, $M, months, 3),
        MMMM: getShort(months, $M),
        D: this.$D,
        DD: Utils.s(this.$D, 2, '0'),
        d: String(this.$W),
        dd: getShort(locale.weekdaysMin, this.$W, weekdays, 2),
        ddd: getShort(locale.weekdaysShort, this.$W, weekdays, 3),
        dddd: weekdays[this.$W],
        H: String($H),
        HH: Utils.s($H, 2, '0'),
        h: get$H(1),
        hh: get$H(2),
        a: meridiemFunc($H, $m, true),
        A: meridiemFunc($H, $m, false),
        m: String($m),
        mm: Utils.s($m, 2, '0'),
        s: String(this.$s),
        ss: Utils.s(this.$s, 2, '0'),
        SSS: Utils.s(this.$ms, 3, '0'),
        Z: zoneStr // 'ZZ' logic below
    }
```

`moment.js`
```js
    formatTokenFunctions = {
        M    : function () {
            return this.month() + 1;
        },
        MMM  : function (format) {
            return this.lang().monthsShort(this, format);
        },
        MMMM : function (format) {
            return this.lang().months(this, format);
        },
        D    : function () {
            return this.date();
        },
        DDD  : function () {
            return this.dayOfYear();
        },
        // ...略
    }
```

2. 通过正则/逐一匹配生成对应时间格式



### echarts 按需引入

```
    // 新建abc.js文件, 如下配置

    // 加载echarts，注意引入文件的路径
    import echarts from 'echarts/lib/echarts'
    
    // 再引入你需要使用的图表类型，标题，提示信息等
    import 'echarts/lib/chart/line'
    import 'echarts/lib/component/legend'
    import 'echarts/lib/component/title'
    import 'echarts/lib/component/tooltip'
    
    export default echarts

    // 在需要的地方引入 abc.js 文件

    // 如果要利用 webpack的 externals
    // externals要用 import 后面的地址
    // 'echarts/lib/echarts',
    // 'echarts/lib/chart/line',
    // 'echarts/lib/component/tooltip',
```

### 关于POST请求的body体

在使用PostMan时，常用的body体有
* form-data -> FormData类型
  * 算x-www-form-urlencoded的超集，既可以上传键值对，也可以上传文件
* x-www-form-urlencoded -> 就是`application/x-www-from-urlencoded,`
  * 原始的表单类型，需要序列化（name=jack&age=18）（使用FormData也行）
* JSON  -> 对象
* raw   -> （未加工的）可以上传任何格式的文本
* binary    -> 相当于`Content-Type:application/octet-stream`
  * 上传文件（只能上传一个）

### HEX 转换 RGB， 判断是否淡色系

> 通过检测 RGB 是否均大于某个值(比如 239), 大于该值则颜色为淡色

转换代码
```
    function transformRGB(x){  
        var sColor = x.toLowerCase();  
        if(sColor && reg.test(sColor)){  
            if(sColor.length === 4){  
                var sColorNew = "#";  
                for(var i=1; i<4; i+=1){  
                    sColorNew += sColor.slice(i,i+1).concat(sColor.slice(i,i+1));     
                }  
                sColor = sColorNew;  
            }  
            //处理六位的颜色值
            var sColorChange = [];  
            for(var i=1; i<7; i+=2){  
                sColorChange.push(parseInt("0x"+sColor.slice(i,i+2)));    
            }  
            //转换为rgb，此时不用传递参数
             return "rgb(" + sColorChange.join(",") + ")";

        }else{  
            return sColor;    
        }  
    }; 
```

### 一个Vue插件BUG

遇到的问题：

做Vue插件在开发环境用`npm link`调试的时候报错：`[Vue warn]: $attrs is readonly`，但是我并没有在任何地方有`$attrs`或`$listeners`明确使用

分析原因：

在`debugger`时能够发现：在代码中使用了两个不同的vue包（vue.esm.js）。更准确地说：某个Vue包的`lifecycle.js`中的`updateChildComponent`函数在启动时将`isUpdatingChildComponent`标志设置为true

```
    !isUpdatingChildComponent && warn("$attrs is readonly.", vm, isUpdatingChildComponent);
```

为什么会有多个Vue文件？ 可能是`vue`与`vue-tempalte-compiler`的版本不一致造成的，看看插件Vue的版本？

还有可能是同时有`import Vue from 'vue/dist/vue.esm'`和`import Vue from 'vue'`之类的导致多个不同Vue的地方，可能是webpack中alias导致的。

弄 Vue 插件的时候传值可以使用 `v-bind="$attrs"`, 将非props的属性传值给子组件。


### npm插件 babel没有作用的问题。

> `.babelrc`是用于本地项目文件的转换（不包括node_modules），而`babel.config.js`绑定（node_modules）

解决方案：一
* **Babel 7.x** 的新功能，Babel具有“根”目录的概念，该目录默认为当前工作目录。对于项目范围的配置，Babel将在此根目录中自动搜索 `babel.config.js`

[参考 issue](https://github.com/babel/babel/issues/8672?tdsourcetag=s_pcqq_aiomsg)

[参考 stackoverflow](https://stackoverflow.com/questions/54788809/babel-7-dont-compile-class-es6-which-in-node-modules/54933703?tdsourcetag=s_pcqq_aiomsg)

解决方案：二（最常见）
* 直接在 npm插件中进行打包，然后`main`指向对应文件（不能用webpack追加hash）


### 埋点设计

> 目前使用的是Vue框架。主要陈述Vue的埋点设计。其他同理。

##### 发送请求

根据实际情况，创建多个Image对象，原则谁空闲谁做事。解决因过快发送埋点数据导致部分埋点缺失的问题。 

```
    function eventPonits() {
        let img = new Image();
        img.src = `xxx.yyy.com`;
        // 会自动垃圾回收不可达代码
    }
```

##### 获取获取用户从哪些页面进入

使用 `document.referrer`


##### 点击事件埋点

利用Vue的自定义事件`directive`进行埋点

```
    clickPoint: {
        inserted: function (el, val) {
            try {
                el.addEventListener('click', (event) => {
                    eventPonits();
                })
            } catch (error) {
            }
        }
    },
```

如果点击埋点过多，可以使用`data-ev` + 事件冒泡来实现。

##### 路由切换埋点

劫持Vue-Router的`beforeEach`进行埋点

```
    beforeEach: (to, from, next) => {
        // 埋点请求
        eventPonits();
    }
```

##### 页面销毁 / 回退埋点

利用`onbeforeunload`事件来埋点

```
    // 在页面关闭前
    window.onbeforeunload= function(){
        // 埋点请求
        eventPonits();
    }
```


### 进程

> 进程像一个工厂

**进程是 CPU 资源分配的最小单位（是能拥有资源和独立运行的最小单位）**,拥有代码和打开的文件资源、数据资源、独立的内存空间。

Node中多进程就是进程的复制（`child_process.fork`）开启多个`子进程`，fork 出来的每个进程都拥有自己的独立空间地址、数据栈，一个进程无法访问另外一个进程里定义的变量、数据结构，只有建立了 IPC 通信，进程之间才可数据共享。

### 线程

> 线程像工厂的员工

**线程是 CPU 调度的最小单位（是建立在进程基础上的一次程序运行单位）**,一个进程中可以并发多个线程，每条线程并行执行不同的任务。

只要线程之间没有共享资源，那么就是线程安全的，有共享资源，为了保证线程安全，需要引进锁的机制。

* 线程安全: 就是多线程访问时，采用了加锁机制，当一个线程访问该类的某个数据时，进行保护，其他线程不能进行访问直到该线程读取完，其他线程才可使用。不会出现数据不一致或者数据污染。
* 线程不安全：就是不提供数据访问保护，有可能出现多个线程先后更改数据造成所得到的数据是脏数据

### 协程

协程，又称微线程，是比线程颗粒度还小的存在。协程看上去也是子程序，但执行过程中，在子程序内部`可中断`，然后转而执行别的子程序，在适当的时候再返回来接着执行。协程不是被操作系统内核所管理，而完全是`由程序所控制`。

优势
* 最大的优势就是协程极高的执行效率。因为子程序切换不是线程切换，而是由程序自身控制，因此，没有线程切换的开销，和多线程比，线程数量越多，协程的性能优势就越明显。
* 第二大优势就是不需要多线程的锁机制，因为只有一个线程，也不存在同时写变量冲突，在协程中控制共享资源不加锁，只需要判断状态就好了，所以执行效率比多线程高很多。

其实，JS的`Generator * yield`就是协程程序。

利用协程可以做时间切片。

![协程](../img/program.jpeg)

### NPM 更新 package.json 包版本

```
    // 全局安装更新插件
    npm install -g npm-check-updates

    // 检查
    ncu

    // 升级 package.json
    ncu -u

    // 更新包
    npm i
```

### node 版本管理 nvm

`nvm`：让你在同一台机器上安装和切换不同版本的node的工具

* `nvm ls-remote`：列出所有可以安装的node版本号
* `nvm install v10.4.0`：安装指定版本号的node
* `nvm use v10.3.0`：切换node的版本，这个是全局的
* `nvm current`：当前node版本
* `nvm ls`：列出所有已经安装的node版本


### 关于 Illegal invocation

js的源生全局对象在使用时某些属性和方法是强制绑定了上下文的。

使用以下语法会报错 `Illegal invocation`

```js
// 案例 1
let $qs = document.querySelector;
$qs('div');
```

```js
// 案例 2
let nav = Object.getOwnPropertyDescriptor(window, 'navigator');
nav.get();
```
