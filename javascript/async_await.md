# async await详解

> `async await`本身就是`promise + generator`的语法糖。await后面的代码是microtask。

```
    async function async1() {
        console.log('async1 start');
        await async2();
        console.log('async1 end');
    }

    // 等价于
    async function async1() {
        console.log('async1 start');
        Promise.resolve(async2()).then(() => {
            console.log('async1 end');
        })
    }
```

## TODO
async await详细语法解析

## End

> 文章分享同步于： https://github.com/zhongmeizhi/gitbook-FED

### [返回主页](/README.md)