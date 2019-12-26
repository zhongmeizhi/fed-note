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



### fastClick

所有版本的Android Chrome浏览器，如果设置viewport meta的值有user-scalable=no，浏览器也是会马上出发点击事件。

`fastClick` 通过 `stopImmediatePropagation` 来终止 后续监听函数的执行