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

### 关于 IOS 键盘弹出问题

> IOS键盘弹出后，是覆盖式的。安卓是上推式的。

```
    const ua = navigator.userAgent;

    const isAndroid = ua.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
    const isiOS = !!ua.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端

    // 监听键盘收起及弹出状态
    document.body.addEventListener('focusout', () => {
        if (isiOS) {
            setTimeout(() => {
            document.body.scrollTop = document.body.scrollHeight
            }, 100)
        }
    })

    document.body.addEventListener('focusin', () => {
        if (isiOS) {
            setTimeout(() => {
            document.body.scrollTop = document.body.scrollHeight
            }, 100)
        }
    })
```

### IOS键盘弹出问题 2 （在WebView中BUG）

在IOS中系统键盘弹出后，webview会弹到上边不回来了。（这个要看Native端，反正我用Flutter没问题，但是在公司某App的Hybrid开发中遇到了）

导致的BUG：webview内部touch等事件的位置不正确

解决方案：
```
    // @ts-ignore 元素blur的时候，回到可视区，使用了事件捕获,
    document.addEventListener(
        'blur', 
        // () => (IS_IOS && document.activeElement.scrollIntoViewIfNeeded(true)),
        () => IS_IOS && window.scrollBy({left: 0,top: 1}),
        true
    );
```

### Hybrid中 new Date 的兼容性BUG

> 在不同的浏览器上：不支持中横线这种时间，得改为斜杠

```
    new Date('2019-07-26 24:00:00'); // 有兼容性问题

    new Date('2019/07/26 24:00:00'); // 没有兼容性问题

```

### 解决IOS中 子元素滚动传播到父元素的情况

> 会出现 dialog滚动到尽头时body滚动的情况 的BUG

解决方案 一：
```
    var mo = function (e) { e.preventDefault() }

    // 禁止页面滑动
    Vue.prototype.$banScroll = function () {
        // 禁止body滚动
        document.body.style.overflow = 'hidden';
        // 禁用原生下拉刷新
        document.addEventListener('touchmove', mo, false);
    }

    // 出现滚动条
    Vue.prototype.$canScroll = function () {
        // 恢复body滚动
        document.body.style.overflow = '';
        // 恢复原生下拉刷新
        document.removeEventListener('touchmove', mo, false);
    }
```

解决方案 二:
```
    .box {
        overscroll-behavior: contain; // 阻止滚动传播
    }
```
ps: overscroll-behavior 的兼容性并没有太好

参考 [can i use](https://www.caniuse.com/#search=overscroll-behavior)

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

### input type="file" 相机和相册问题

2个属性的坑：`accept="image/*"` 和 `capture="camera"`

关于`capture="camera"` 一般情况下：
* `Android`系统：input`加上capture="camera"`，可以调用相机+相册
  * android可以同时使用2个属性
* `ios`系统：input`去掉capture属性`，可以调用相机 +相册
  * 如果加上`capture="camera"` 只调相机

关于`accept="image/*"`
* 如果限制图片枚举不够，会出现Android无法调用相册的情况。
* 推荐用`accept="image/*"`


### input 问题2， IOS中placeholder在input上部

解决方案：
1. chrome浏览器展示 DOM 的隐藏项
2. 步骤：chrome -> `setting` -> `preferences` -> `Elements` -> 勾选 `Show user agent shadow DOM`
3. 检查 placeholder 的DOM元素和 input的DOM元素高度，
4. 设置 placeholder 的 `line-light` 使用顶部和 input顶部一致


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

### npm插件 babel没有作用的问题。

> `.babelrc`是用于本地项目文件的转换（不包括node_modules），而`babel.config.js`绑定（node_modules）

解决方案：一
* **Babel 7.x** 的新功能，Babel具有“根”目录的概念，该目录默认为当前工作目录。对于项目范围的配置，Babel将在此根目录中自动搜索 `babel.config.js`

[参考 issue](https://github.com/babel/babel/issues/8672?tdsourcetag=s_pcqq_aiomsg)

[参考 stackoverflow](https://stackoverflow.com/questions/54788809/babel-7-dont-compile-class-es6-which-in-node-modules/54933703?tdsourcetag=s_pcqq_aiomsg)

解决方案：二（最常见）
* 直接在 npm插件中进行打包，然后`main`指向对应文件（不能用webpack追加hash）

