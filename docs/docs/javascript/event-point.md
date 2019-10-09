# 简单且通用的埋点设计

目前使用的是Vue框架。主要陈述Vue的埋点设计。其他同理。

### 发送请求

根据实际情况，创建多个Image对象，原则谁空闲谁做事。解决因过快发送埋点数据导致部分埋点缺失的问题。 

```
    function eventPonits() {
        let img = new Image();
        img.src = `xxx.yyy.com`;
        // 会自动垃圾回收不可达代码
    }
```

### 获取获取用户从哪些页面进入

使用 `document.referrer`


### 点击事件埋点

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

### 路由切换埋点

劫持Vue-Router的`beforeEach`进行埋点

```
    beforeEach: (to, from, next) => {
        // 埋点请求
        eventPonits();
    }
```


### 页面销毁 / 回退埋点

利用`onbeforeunload`事件来埋点

```
    // 在页面关闭前
    window.onbeforeunload= function(){
        // 埋点请求
        eventPonits();
    }
```

### End

