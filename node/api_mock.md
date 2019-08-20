# 使用Node写一个Mock服务

实现思路：
1. 读取mock文件夹
2. 遍历`.js`文件
3. 尝试导入文件内容
4. 将文件内容拼接成一个对象
5. 将`请求类型 + 空格 + 请求地址`作为key
6. 当收到的请求能在js对象中找到就返回结果
7. 找不到结果返回404
8. Mock服务在开发环境的使用

### 获取文件内容

```
    // ./src/utils/getMock.js

    const fs = require('fs');
    const path = require('path');

    const getMockBundleOfDir = (mockDirPath) => {
        // 同步读取mock文件夹 
        const fileNameList = fs.readdirSync(mockDirPath);
        // mock对象汇总
        let mockBundle = {};
        // 遍历文件
        fileNameList.forEach(fileName => {
            const filePtah = path.resolve(`${mockDirPath}/${fileName}`);
            // 只读取JS文件
            if (fileName.endsWith('.js')) {
                // 容错，可能文件内容有问题
                try {
                    const content = require(filePtah);
                    // 只合并对象
                    if (Object.prototype.toString.call(content) === '[object Object]') {
                        Object.assign(mockBundle, content);
                    }
                } catch (error) {
                    console.log('\033[41;37m', `读取${filePtah}文件出错`, '\033[0m');
                }
            }
        })
        return mockBundle;
    }

    module.exports = getMockBundleOfDir;
```

### 实现解析

```
    const Koa = require('koa');
    const koaBody = require('koa-body');
    const getMockBundleOfDir = require('./src/utils/getMock.js');

    const toString = Object.prototype.toString;
    const mockDirPath = './src/mock'; // mock目录地址

    // 获取mock对象集合
    let mockBundle = getMockBundleOfDir(mockDirPath);

    const app = new Koa();
    app.use(koaBody()); // koa插件，用来解析post请求的body

    // mock请求
    app.use(async (ctx, next) => {
        // 对应mock的请求类型 + 空格 + 请求地址的映射
        const request = `${ctx.method} ${ctx.path}`;
        // TODO 容错
        try {
            const mock = mockBundle[request];
            const mockType = toString.call(mock);
            if (mockType === '[object Function]') { // mock数据为函数
                let query;
                if (ctx.method === 'GET') {
                    query = ctx.query;
                } else if (ctx.method === 'POST') {
                    query = ctx.request.body;
                }
                // 返回mock结果
                const response = mock(query);
                return ctx.body = response;
            } else if (mock) { // 有值
                return ctx.body = mock;
            }
        } catch (error) {
            ctx.status = 500;
            return ctx.body = {
                error,
                msg: 'mock函数执行出错'
            }
        }
        // 找不到mock函数，那么next
        next();
    })


    // 底线
    app.use(async ctx => {
        let html = `
            <h1>404</h1>
            <h2>请确认URL是否正确、请求类型是否大写</h2>
        `;
        ctx.status = 404;
        ctx.body = html
    })

    app.on('error', err => {
        console.error('系统错误', err)
    });

    app.listen(3333, () => {
        // console.log(process.argv, 'argv')
        console.log('\033[44;37m > 开始运行 ', '端口3333', '\033[0m');
    });

```

### Mock服务在开发环境的使用


达到的效果：

在开发环境中就可以在url后面添加`?ismock=1`参数来实现数据mock，(没有该参数就访问正常数据)，且不会对测试环境和生产环境造成任何影响

实现步骤：

1. 通过Webpack设置代理。

    ```
        //webpack.config.js

        proxy: {
            '/mock': {
                target: 'mock',
                changeOrigin:true,
                pathRewrite: {
                    '^/mock': ''
                }
            }
        }
    ```

2. 拦截请求(比如Axios自带的拦截器)
   * 判断url参数(如`?ismock=1`)
   * 判断当前环境(如`process.env.NODE_ENV == 'development'`)
   * 添加`baseUrl = /mock`

3. 在webpack的压缩处理中删除不可达代码（见webpack配置表）


### [源码地址](https://github.com/zhongmeizhi/z-mock)