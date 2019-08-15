# CSS渐进增强

> 渐进增强（progressive enhancement）：针对低版本浏览器进行构建页面，保证最基本的功能，然后再针对高级浏览器进行效果、交互等改进和追加功能达到更好的用户体验：

### 最简单的方案

将高版本浏览器支持的特性写在后面。利用浏览器的2个CSS解析特性：
* 后面的属性覆盖前面的属性
* 遇到不认识的语法，CSS parser 不解析。

```
    div {
        background: red;
        background: linear-gradient(90deg, red, yellow)
    }
```

### 使用CSS判断CSS属性支持情况 

使用`@supports`判断属性支持:
```
    // 支持特定属性的处理
    @supports (position:sticky) {
        div {
            position:sticky;
        }
    }
    
    // 不支持特定属性：用not处理
    @supports not (background: linear-gradient(90deg, red, yellow)) {
        div {
            background: red;
        }
    }

    // 如果是多个css属性：用and处理
    @supports (display:-webkit-box) and (-webkit-line-clamp:2) and (-webkit-box-orient:vertical) {
        p {
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
        }
    }
```

### 使用JS判断CSS属性支持情况

1. CSS.supports()

作为 @supports 的另一种形式出现的，我们可以使用 javascript 的方式来获得 CSS 属性的支持情况。

`CSS.supports('display', 'flex');`  必须2个参数， 否则返回false

2. modernizr

如果浏览器不支持`@supports`，可以通过调用ele.style来判断属性支持情况（库：[Modernizr](https://github.com/Modernizr/Modernizr)）

```
    var root = document.documentElement; //HTML
 
    for(var key in root.style) {
        console.log(key);
    }

    // 将会打印
    // alignContent
    // alignItems
    // alignSelf
    // alignmentBaseline
    // all
    // animation
    // ...
```

元素可能有 background 属性，但是不支持具体的 linear-gradinet() 属性值。这个时候该如何检测呢？只需要将具体的值赋值给某一元素，再查询这个属性值能否被读取。

```
    var root = document.documentElement;
 
    root.style.backgroundImage = 'linear-gradient(90deg, #888, #ccc)';
    
    if(root.style.backgroundImage) {
    // 支持
    } else {
    // 不支持
    }
```

### 简单实用的检查

```
    /**
    * 用于简单的 CSS 特性检测
    * @param [String] property 需要检测的 CSS 属性名
    * @param [String] value 样式的具体属性值
    * @return [Boolean] 是否通过检查
    */
    function cssTest(property, value) {
        // CSS && CSS.supports
        // CSS.supports('display', 'flex');  必须2个参数， 否则返回false
        
        // 用于测试的元素，隐藏在页面上
        var ele = document.getElementById('test-display-none');
    
        // 只有一个参数的情况
        if(arguments.length === 1) {
            if(property in ele.style) {
                return true;
            }
        // 两个参数的情况
        }else if(arguments.length === 2){
            ele.style[property] = value;
    
            if(ele.style[property]) {
                return true;
            }
        }
    
        return false;
    }
```

### 参考

* [chokcoco的github](https://github.com/chokcoco/iCSS)
* [Modernizr库](https://github.com/Modernizr/Modernizr)