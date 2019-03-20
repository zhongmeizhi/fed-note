# 踩坑笔记

* 接别人的代码，使用gulp上次图片到CDN的时候报错：`mime.lookup is not a function`，因为mime的2.x版本改变了方法名。注意：~~package.json中没有主动引入mime包。~~
    1. 删除报错文件引入包
    2. `cnpm i mime@1.3.4` 主动下载1.x版本的

> 文章分享同步于： https://github.com/zhongmeizhi/gitbook-FED
  ## [返回主页](/README.md)