# async await特性详解

> `async await`本身就是`promise + generator`的语法糖。

### async await 特性

1. async 一定会返回 promise
```
    // 案例1： 不设置return
    async function fn() {}
    fn().then(alert); // alert -> undefined

    // 案例2：return非promise
    async function f() {
        return 1
    }
    f().then(alert); // alert -> 1

    // 案例3： return Promise
    async function fn() {
        return Promise.resolve(2);
    }
    fn().then(alert); // alert -> 2
```

2. async 中代码是直接执行的（同步任务）
```
    console.log(1);

    async function fn() {
        console.log(2);
        await console.log(3)
        console.log(4)
     }
    fn();

    console.log(5);

    // 打印 1 2 3 5 4
    // 为何后面是 3 5 4 ? 往下看
```

3. await是直接执行的，而await后面的代码是 microtask。

```
    async function async1() {
        console.log('async1 start');
        await async2();
        console.log('async1 end');
    }

    // 类似于
    async function async1() {
        console.log('async1 start');
        Promise.resolve(async2()).then(() => {
            console.log('async1 end');
        })
    }

    // 自执行generator的语法糖
    async function async1() {
        console.log('async1 start');
        
        var awaitInstance = (function* awaitFn () {
            yield async2();
            yield console.log('async1 end');
        })()

        var awaitNext
        do {
            awaitNext = awaitInstance.next()
        } while (!awaitNext.done)
    }
```

4. await后面代码会等await内部代码全部完成后再执行
```
    async function async1() {
        console.log('async1 start');
        await async2();
        console.log('async1 end');
    }

    async function async2() {
        return new Promise(function(resolve) {
            setTimeout(function() {
                console.log('sleep 2s');
                resolve('do');
            }, 2000)
        })
    }

    async1();

    // 打印结果
    // async1 start -> sleep 2s -> async1 end
```

5. await  操作符用于等待一个Promise 对象。它只能在异步函数 async function 中使用。参考 [MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/await)
```
    附：
    在chrome版本 73.0.3683.86（64 位）中,
    await是可以直接使用的。

    var x = await console.log(1)
```

## End

> 文章分享同步于： https://github.com/zhongmeizhi/gitbook-FED

### [返回主页](/README.md)