# 前端安全

### XSS 攻击

跨站脚本攻击（Cross-site scripting），攻击者往 Web 页面里插入可执行的网页脚本代码，当用户浏览该页之时，嵌入其中 Web 里面的脚本代码会被执行，从而可以达到攻击者盗取用户信息或其他侵犯用户安全隐私的目的。

主要分2种：
* 通过URL参数注入，如：链接输入`https://abc/?wd=<script>alert(document.cookie)</script>`
* 通过表单注入脚本。如：表单中输入`<script>alert('入库数据')</script>`

如何预防：
* **转义**：最普遍的做法是转义输入输出的内容，对于引号，尖括号，斜杠进行转义
* Header设置[Content-Security-Policy](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Content-Security-Policy__by_cnvoid)


### CSRF 攻击

跨站请求伪造（Cross-site request forgery），利用用户的登录态发起恶意请求。

![图片](/img/security.png)

如何防御：
* **阻止第三方网站请求接口**（比如校验 Referer）
* 设置cookie为HttpOnly
* 验证码

### [返回主页](/README.md)