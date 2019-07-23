# 如果让网页更流畅


# TODO

60Hz，16.7ms


如何避免长任务
* Web Worker
* Time Slicing（时间切片），比如React的`fiber`

时间分片

```
    function init({ sliceList, callback }) {
        if (!isFunction(callback)) {
            return new Error('不是function');
        }
        // 添加切片队列
        this.generator = this.sliceQueue({
            sliceList,
            callback
        });
        // 开始切片
        this.next();
    }

    function* sliceQueue({ sliceList, callback }) {
        let listOrNum = (isNum(sliceList) && sliceList) || (isArray(sliceList) && sliceList.length);
        for (let i = 0; i < listOrNum; ++i) {
            const start = performance.now();
            callback(i);
            while (performance.now() - start < 16.7) {
                yield;
            }
        }
    }
```