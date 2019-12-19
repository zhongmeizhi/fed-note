# async await详解

> `async await`本身就是`promise + generator`的语法糖。

会讲述以下内容
1. async awiat 实质 || 降级策略
2. async await 主要特性

### async await 实质 && 降级策略

```
    // 转换目标 async1

    // async function async1() {
    //    console.log('async1 start');
    //    await async2();
    //    console.log('async1 end');
    // }
```

下面使用 promise + generate 实现 async await
```
    function async1() {
        // 将 async 转换成 *，将 awiat 转换成 yield
        var awaitInstance = (function* () {
            console.log('async1 start');
            yield async2();
            console.log('async1 end');
        })()

        // 自动执行 await 及后续代码
        // 简单起见，不处理异常情况
        function step() {
            var next = awaitInstance.next();
            // 使用Promise获取 异步/同步 方法的结果，再执行下一步
            Promise.resolve(next.value).then(function (val) {
                if (!next.done) step();
            })
        }
        step();

        // 返回Promise
        return Promise.resolve(undefined);
    }
```

将上述代码完善异常操作，得到async await的降级策略，只要AST 将 async 转换成 *，将 awiat 转换成 yield，就能实现降级。

```
    function async1(args) {
        return myAsyncAwait(function* () {
            console.log('async1 start');
            yield async2();
            console.log('async1 end');
        });
    }

    function myAsyncAwait(genFn) {
        return new Promise(function(resolve, reject) {
            const gen = genFn();
            function step(nextFn) {
                let next;
                try {
                    next = nextFn();
                } catch(e) {
                    return reject(e);
                }
                if(next.done) {
                    return resolve(next.value);
                }
                Promise.resolve(next.value).then(function(v) {
                    step(function() { return gen.next(v); });
                }, function(e) {
                    step(function() { return gen.throw(e); });
                });
            }
            step(function() { return gen.next(undefined); });
        });
    }
```

### async await 特性

1. async 一定会返回 promise
2. async、 await、Promise.resolve() 都是（同步任务）
3. 而await 后续代码都会被推到 microtask 中。等await执行完成后触发。
    * 完成可能是：代码全部完成执行通过 || 或者最终被`.catch`（其实也是算都执行执行）
    * 如果有未被捕获的异常，就不会进入await下一步（毕竟await的下一步也类似于推到了then中）
```
    console.log(1);

    async function fn() {
        console.log(2);
        await console.log(3);
        await Promise.resolve(4).then(console.log);;
        console.log(5);

        // 上面的写法类似于
        // console.log(2);
        // console.log(3);
        // Promise.resolve(4)
        //   .then(console.log);
        //   .then(() => {
        //     console.log(4);
        // })
     }
    fn();

    console.log(6);

    // 打印 1 2 3 6 4 5
```

1. 可以用await接收async的结果。然后赋值给变量
```
    async function fn() {
        return Promise.resolve('xxxx');
    }

    async function fn2() {
        let x = await fn();
        console.log('x', xxx); // 输出的是值而不是Promise 
    }

    fn2()
```

5. await  操作符用于等待一个Promise 对象。它只能在异步函数 async function 中使用。参考 [MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/await)
```
    附：
    在chrome版本 73.0.3683.86（64 位）中,
    await是可以直接使用的。

    var x = await console.log(1)
```

