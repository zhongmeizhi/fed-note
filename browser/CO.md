# 关于跨域问题

面试必考题吧，所以在这会详细介绍以下内容
1. 跨域产生的原因
2. 罗列最常用的解决方法
3. 分析各种方法原理
4. 罗列各种方法优缺点

### 什么是跨域
由于浏览器厂商对安全性的考虑，提出了`浏览器的同源策略`做为解决方案。它是一个用于隔离潜在恶意文件的重要安全机制。同源即`协议`、`域名`、`端口`三者一致。不同源即跨域。

##### 如果没有同源策略会怎么样？
比如：当你访问了 饼夕夕的网站
```
// HTML
// 饼夕夕.com 内嵌 拼多多.com
<iframe name="pinduoduo" src="www.pinduoduo.com"></iframe>

// JS
// 由于没有同源策略的限制，钓鱼网站可以直接拿到别的网站的Dom
// 所以 饼夕夕.com 可以在 拼多多.com 输入账号密码处埋点
const $iframe = window.frames['pinduoduo'];
const $pwd = $iframe.document.getElementById('password');
console.log(`你的密码已泄露: ${$pwd}`)
```

### 解决方案（主流）

**1. JSONP -> get请求跨域**

原理：script和img等标签没有跨域限制

具体实现：
```
  // HTML 插入标签
  <script src="127.0.0.1/x/account?cb=say" ></script>

  // JS
  function say(name, age) {
    console.log(`${name}, ${age} 岁`)
  }

  // 服务器返回response
  say('zmz', 18)

  // 那么客户端在script onload时会执行say方法

  // 结束
```
**2. iframe+form实现post请求跨域**

原理：利用form表单target属性，将post请求提交给隐藏的iframe，使页面不跳转

具体实现：
```
  var data = {
    name: 'zmz',
    age: 18
  }
  var url = 'http://localhost/say';

  var $iframe = document.createElement('iframe');
  $iframe.name = 'iframePost';
  $iframe.style.display = 'none';
  document.body.appendChild($iframe);
  
  $iframe.addEventListener('load', function(e) {
    console.log($iframe.contentWindow)
  })
  
  const form = document.createElement('form');
  const ipt = document.createElement('input');
  form.action = url;
  form.enctype = 'application/json;'
  form.method = 'post';

  // 最核心的一行代码
  // 在指定的iframe中执行form
  form.target = $iframe.name;

  for (var name in data) {
      ipt.name = name;
      ipt.value = data[name]; 
      form.appendChild(ipt.cloneNode());
  }
  form.style.display = 'none';
  document.body.appendChild(form);
  form.submit();
  
  document.body.removeChild(form)
```

**3. CORS 跨源资源共享**

原理：新版XMLHttpRequest(ajax2.0)特性，服务器白名单

服务器端设置`response.setHeader("Access-Control-Allow-xxx...`

附：ajax2.0新特性
* 可以设置HTTP请求的时限`xhr.timeout`
* 可以使用`FormData`对象管理表单数据
* 可以上传文件 >> 同上
* 可以请求不同域名下的数据（跨域请求）
* 可以获取服务器端的二进制数据`xhr.responseType = 'blob'`
* 可以获得数据传输的进度信息 `xhr.upload.process`

CORS分类
* 简单请求(自行搜索)
  * 在请求头信息中指定`Origin`
* 非简单请求
  * 会发送预检请求(options)，返回状态码204


**5. 代理**

原理：服务器之间没有跨域限制

具体实现：
```
  // Nginx配置
  server{
    # 监听9099端口
    listen 9099;
    # 域名是localhost
    server_name localhost;
    # 匹配到都转发到http://localhost:9871 
    location ^~ /api {
        proxy_pass http://localhost:9871;
    }    
}
```

**5. postMessage**

原理：postMessage可以处理各种浏览器窗口之间的通信问题。

具体实现：
```
  // 发送方
  window.frames['crossDomainIframe']
  iframe.postMessage('我想要数据', 'http://localhost:8088')

  window.addEventListener('message', function () {
    if (e.origin === 'http://localhost:2333') {
      console.log('收到', e.data)
    }
  }

  // 接收方
  window.addEventListener('message', (e) => {
    if (e.origin === 'http://localhost:8088') {
      console.log(e.data)
      e.source.postMessage('给，你要的数据', e.origin);
    }
  })
```

**6. WebSocket**

原理：新协议(socket)

具体实现：类似postMessage

附：
* socket.io框架能解决兼容性问题


### 各种方式对比
* JSONP和iframe+from兼容性很好
  * 但是错误处理和RESTful接口统一是个问题
* CORS最简单粗暴
  *  和Vue兼容性类似。
* 代理
  * 肯定会慢一丢丢咯，而且要找运维配
* postMessage
  * 处理窗口间通信，- -。不嫌麻烦可以用来跨域
* WebSocket
  * 处理长连接，附带跨域

## End
> 文章分享同步于： https://github.com/zhongmeizhi/gitbook-FED
### [返回主页](/README.md)