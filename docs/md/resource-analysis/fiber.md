# fiber

本人系一个惯用Vue的菜鸡，恰巧周末和大佬扯蛋，峰回路转谈到了fiber，被大佬疯狂鄙视...

大佬还和我吐槽了现在的忘了环境
1. 百度是不可信的，百度到的东西出来广告其他都是出自同一个作者（大部分情况确实这样）
2. 很多水文都是以 copy 的形式产生的，你看到的文章说不定已经过时好几个版本了（大部分情况确实这样）

于是本菜开始了 React Fiber 相关的读源码过程。为什么看 Fiber？因为 Vue 没有，Vue3 也没有，但是却被吹的很神奇。

本菜于编写时间于：`2020/05/25`，参考的当日源码版本 `v16.13.1`

### Fiber的出现是为了解决什么问题？ <略过一下>

首先必须要知道为什么会出现 Fiber

旧版本React同步更新：当React决定要加载或者更新组件树时，会做很多事，比如调用各个组件的生命周期函数，计算和比对Virtual DOM，最后更新DOM树。

举个栗子：更新一个组件需要1毫秒，如果要更新1000个组件，那就会耗时`1秒`，在这`1秒`的更新过程中，主线程都在专心运行更新操作。

而浏览器每间隔一定的时间重新绘制一下当前页面。一般来说这个频率是每秒60次。也就是说每16毫秒（ 1 / 60 ≈ 0.0167 ）浏览器会有一个周期性地重绘行为，这每16毫秒我们称为一帧。这一帧的时间里面浏览器做些什么事情呢：

1. 执行JS。
2. 计算Style。
3. 构建布局模型(Layout)。
4. 绘制图层样式(Paint)。
5. 组合计算渲染呈现结果(Composite)。

如果这六个步骤中，任意一个步骤所占用的时间过长，总时间超过 16ms 了之后，用户也许就能看到卡顿。而上述栗子中组件同步更新耗时 `1秒`，意味着差不多用户卡顿了 1秒钟！！！（差不多 - -!）

因为JavaScript单线程的特点，每个同步任务不能耗时太长，不然就会让程序不会对其他输入作出相应，React的更新过程就是犯了这个禁忌，而React Fiber就是要改变现状。


### 什么是 Fiber <略过一下>

解决同步更新的方案之一就是时间切片：把更新过程碎片化，把一个耗时长的任务分成很多小片。执行非阻塞渲染，基于优先级应用更新以及在后台预渲染内容。

Fiber 就是由 `performUnitOfWork`（ps：后文详细讲述） 方法操控的 **工作单元**，作为一种数据结构，用于代表某些worker，换句话说，就是一个work单元，通过Fiber的架构，提供了一种跟踪，调度，暂停和中止工作的便捷方式。

Fiber的创建和使用过程：

1. 来自render方法返回的每个React元素的数据被合并到fiber node树中
2. React为每个React元素创建了一个fiber node
3. 与React元素不同，每次渲染过程，不会再重新创建fiber
4. 随后的更新中，React重用fiber节点，并使用来自相应React元素的数据来更新必要的属性。
5. 同时React 会维护一个 `workInProgressTree` 用于计算更新（双缓冲），可以认为是一颗表示当前工作进度的树。还有一颗表示已渲染界面的旧树，React就是一边和旧树比对，一边构建WIP树的。 `alternate` 指向旧树的同等节点。

PS：上文说的 `workInProgress` 属于 `beginWork` 流程了，如果要写下来差不多篇幅还会增加一倍，这就不详细说明了...（主要是本人懒又菜...）

Fiber的体系结构分为两个主要阶段：`reconciliation`（协调）/`render 和 commit`，

### React 的 Reconciliation 阶段 <略过一下>

> Reconciliation 阶段在 Fiber重构后 和旧版本思路差别不大, 只不过不会再递归去比对、而且不会马上提交变更。

涉及生命钩子

* shouldComponentUpdate
* ~~componentWillMount~~（废弃）
* ~~componentWillReceiveProps~~（废弃）
* ~~componentWillUpdate~~（废弃）
* static getDerivedStateFromProps

`reconciliation` 特性：
* 可以打断，在协调阶段如果时间片用完，React就会选择让出控制权。因为协调阶段执行的工作不会导致任何用户可见的变更，所以在这个阶段让出控制权不会有什么问题。
* 因为协调阶段可能被中断、恢复，甚至重做，React 协调阶段的生命周期钩子可能会被调用多次!, 例如 componentWillMount 可能会被调用两次。
* 因此协调阶段的生命周期钩子不能包含副作用，所以，该钩子就被废弃了

完成 reconciliation 过程。这里用的是 `深度优先搜索(DFS)`，先处理子节点，再处理兄弟节点，直到循环完成。

### React 的 Commit 阶段 <略过一下>

涉及生命钩子

* componentDidMount
* componentDidUpdate
* ~~componentWillUnmount~~（废弃）
* getSnapshotBeforeUpdate

`render` 和 `commit`：不能暂停，会一直更新界面直到完成


### Fiber 如何处理优先级？

对于UI来说需要考虑以下问题：

并不是所有的state更新都需要立即显示出来，比如:

* 屏幕之外的部分的更新并不是所有的更新优先级都是一样的
* 用户输入的响应优先级要比通过请求填充内容的响应优先级更高
* 理想情况下，对于某些高优先级的操作，应该是可以打断低优先级的操作执行的

所以，React 定义了一系列事件优先级

下面是优先级时间的源码

[源码文件]（https://github.com/facebook/react/blob/a152827ef697c55f89926f9b6b7aa436f1c0504e/packages/scheduler/src/Scheduler.js）

```js
  var maxSigned31BitInt = 1073741823;

  // Times out immediately
  var IMMEDIATE_PRIORITY_TIMEOUT = -1;
  // Eventually times out
  var USER_BLOCKING_PRIORITY = 250;
  var NORMAL_PRIORITY_TIMEOUT = 5000;
  var LOW_PRIORITY_TIMEOUT = 10000;
  // Never times out
  var IDLE_PRIORITY = maxSigned31BitInt;
```

当有更新任务来的时候，不会马上去做 Diff 操作，而是先把当前的更新送入一个 Update Queue 中，然后交给 `Scheduler` 去处理，Scheduler 会根据当前主线程的使用情况去处理这次 Update。

不管执行的过程怎样拆分、以什么顺序执行，Fiber 都会保证状态的一致性和视图的一致性。

如何保证相同在一定时间内触发的优先级一样的任务到期时间相同？ React 通过 `ceiling` 方法来实现的。。。本菜没使用过 `|` 语法...

下面是处理到期时间的 `ceiling` 源码

[源码文件]（https://github.com/facebook/react/blob/a152827ef697c55f89926f9b6b7aa436f1c0504e/packages/scheduler/src/Scheduler.js）

```js
function ceiling(num, precision) {
  return (((num / precision) | 0) + 1) * precision;
}
```

那么为什么需要保证时间一致性？请看下文。


### Fiber 如何调度？

首先要找到调度入口地址 `scheduleUpdateOnFiber`，

每一个root都有一个唯一的调度任务，如果已经存在，我们要确保到期时间与下一级别任务的相同（所以用上文提到的 `ceiling` 方法来控制到期时间）

[源码文件](https://github.com/facebook/react/blob/142d4f1c00c66f3d728177082dbc027fd6335115/packages/react-reconciler/src/ReactFiberWorkLoop.old.js)

```js
export function scheduleUpdateOnFiber(
  fiber: Fiber,
  expirationTime: ExpirationTime,
) {
  checkForNestedUpdates();
  warnAboutRenderPhaseUpdatesInDEV(fiber);

  // 调用markUpdateTimeFromFiberToRoot，更新 fiber 节点的 expirationTime
  // ps 此时的fiber树只有一个root fiber。
  const root = markUpdateTimeFromFiberToRoot(fiber, expirationTime);
  if (root === null) {
    warnAboutUpdateOnUnmountedFiberInDEV(fiber);
    return;
  }

  // TODO: computeExpirationForFiber also reads the priority. Pass the
  // priority as an argument to that function and this one.
  // 还只是TODO
  // computeExpirationForFiber还会读取优先级。
  // 将优先级作为参数传递给该函数和该函数。
  const priorityLevel = getCurrentPriorityLevel();

  if (expirationTime === Sync) {
    if (
      // Check if we're inside unbatchedUpdates
      // 检查是否在未批处理的更新内
      (executionContext & LegacyUnbatchedContext) !== NoContext &&
      // Check if we're not already rendering
      // 检查是否尚未渲染
      (executionContext & (RenderContext | CommitContext)) === NoContext
    ) {
      // Register pending interactions on the root to avoid losing traced interaction data.
      // 在根上注册待处理的交互，以避免丢失跟踪的交互数据。
      schedulePendingInteractions(root, expirationTime);

      // This is a legacy edge case. The initial mount of a ReactDOM.render-ed
      // root inside of batchedUpdates should be synchronous, but layout updates
      // should be deferred until the end of the batch.
      performSyncWorkOnRoot(root);
    } else {
      ensureRootIsScheduled(root);
      schedulePendingInteractions(root, expirationTime);
      if (executionContext === NoContext) {
        // Flush the synchronous work now, unless we're already working or inside
        // a batch. This is intentionally inside scheduleUpdateOnFiber instead of
        // scheduleCallbackForFiber to preserve the ability to schedule a callback
        // without immediately flushing it. We only do this for user-initiated
        // updates, to preserve historical behavior of legacy mode.
        // 推入调度任务队列
        flushSyncCallbackQueue();
      }
    }
  } else {
    // Schedule a discrete update but only if it's not Sync.
    if (
      (executionContext & DiscreteEventContext) !== NoContext &&
      // Only updates at user-blocking priority or greater are considered
      // discrete, even inside a discrete event.
      (priorityLevel === UserBlockingPriority ||
        priorityLevel === ImmediatePriority)
    ) {
      // This is the result of a discrete event. Track the lowest priority
      // discrete update per root so we can flush them early, if needed.
      if (rootsWithPendingDiscreteUpdates === null) {
        rootsWithPendingDiscreteUpdates = new Map([[root, expirationTime]]);
      } else {
        const lastDiscreteTime = rootsWithPendingDiscreteUpdates.get(root);
        if (
          lastDiscreteTime === undefined ||
          lastDiscreteTime > expirationTime
        ) {
          rootsWithPendingDiscreteUpdates.set(root, expirationTime);
        }
      }
    }
    // Schedule other updates after in case the callback is sync.
    ensureRootIsScheduled(root);
    schedulePendingInteractions(root, expirationTime);
  }
}
```

上面源码主要做了以下几件事

1. 调用 `markUpdateTimeFromFiberToRoot` 更新 Fiber 节点的 `expirationTime`
2. `ensureRootIsScheduled`（更新重点）
3. `schedulePendingInteractions` 实际上会调用 `scheduleInteractions` 
  * `scheduleInteractions` 会利用FiberRoot的 `pendingInteractionMap` 属性和不同的 `expirationTime`，获取每次schedule所需的update任务的集合，记录它们的数量，并检测这些任务是否会出错。

更新的重点在于 `scheduleUpdateOnFiber` 每一次更新都会调用 `function ensureRootIsScheduled(root: FiberRoot)`

下面是 `ensureRootIsScheduled` 的源码

[源码文件](https://github.com/facebook/react/blob/142d4f1c00c66f3d728177082dbc027fd6335115/packages/react-reconciler/src/ReactFiberWorkLoop.old.js)

```js
function ensureRootIsScheduled(root: FiberRoot) {
  const lastExpiredTime = root.lastExpiredTime;
  if (lastExpiredTime !== NoWork) {
    // Special case: Expired work should flush synchronously.
    root.callbackExpirationTime = Sync;
    root.callbackPriority_old = ImmediatePriority;
    root.callbackNode = scheduleSyncCallback(
      performSyncWorkOnRoot.bind(null, root),
    );
    return;
  }

  const expirationTime = getNextRootExpirationTimeToWorkOn(root);
  const existingCallbackNode = root.callbackNode;
  if (expirationTime === NoWork) {
    // There's nothing to work on.
    if (existingCallbackNode !== null) {
      root.callbackNode = null;
      root.callbackExpirationTime = NoWork;
      root.callbackPriority_old = NoPriority;
    }
    return;
  }

  // TODO: If this is an update, we already read the current time. Pass the
  // time as an argument.
  const currentTime = requestCurrentTimeForUpdate();
  const priorityLevel = inferPriorityFromExpirationTime(
    currentTime,
    expirationTime,
  );

  // If there's an existing render task, confirm it has the correct priority and
  // expiration time. Otherwise, we'll cancel it and schedule a new one.
  if (existingCallbackNode !== null) {
    const existingCallbackPriority = root.callbackPriority_old;
    const existingCallbackExpirationTime = root.callbackExpirationTime;
    if (
      // Callback must have the exact same expiration time.
      existingCallbackExpirationTime === expirationTime &&
      // Callback must have greater or equal priority.
      existingCallbackPriority >= priorityLevel
    ) {
      // Existing callback is sufficient.
      return;
    }
    // Need to schedule a new task.
    // TODO: Instead of scheduling a new task, we should be able to change the
    // priority of the existing one.
    cancelCallback(existingCallbackNode);
  }

  root.callbackExpirationTime = expirationTime;
  root.callbackPriority_old = priorityLevel;

  let callbackNode;
  if (expirationTime === Sync) {
    // Sync React callbacks are scheduled on a special internal queue
    callbackNode = scheduleSyncCallback(performSyncWorkOnRoot.bind(null, root));
  } else if (disableSchedulerTimeoutBasedOnReactExpirationTime) {
    callbackNode = scheduleCallback(
      priorityLevel,
      performConcurrentWorkOnRoot.bind(null, root),
    );
  } else {
    callbackNode = scheduleCallback(
      priorityLevel,
      performConcurrentWorkOnRoot.bind(null, root),
      // Compute a task timeout based on the expiration time. This also affects
      // ordering because tasks are processed in timeout order.
      {timeout: expirationTimeToMs(expirationTime) - now()},
    );
  }

  root.callbackNode = callbackNode;
}
```

上面源码 `ensureRootIsScheduled` 主要是根据同步/异步状态做不同的 push 功能。

同步调度 `function scheduleSyncCallback(callback: SchedulerCallback)` ：
* 如果队列不为空就推入同步队列（`syncQueue.push(callback)`）
* 如果为空就立即推入 **任务调度队列**(`Scheduler_scheduleCallback`)
* 会将 `performSyncWorkOnRoot` 作为 `SchedulerCallback`

下面是 `scheduleSyncCallback` 源码内容

[源码文件](https://github.com/facebook/react/blob/4c6470cb3b821f3664955290cd4c4c7ac0de733a/packages/react-reconciler/src/SchedulerWithReactIntegration.old.js)

```js
export function scheduleSyncCallback(callback: SchedulerCallback) {
  // Push this callback into an internal queue. We'll flush these either in
  // the next tick, or earlier if something calls `flushSyncCallbackQueue`.
  if (syncQueue === null) {
    syncQueue = [callback];
    // Flush the queue in the next tick, at the earliest.
    immediateQueueCallbackNode = Scheduler_scheduleCallback(
      Scheduler_ImmediatePriority,
      flushSyncCallbackQueueImpl,
    );
  } else {
    // Push onto existing queue. Don't need to schedule a callback because
    // we already scheduled one when we created the queue.
    syncQueue.push(callback);
  }
  return fakeCallbackNode;
}

```

异步调度，异步的任务调度很简单，直接将异步任务推入调度队列(`Scheduler_scheduleCallback`)，会将 `performConcurrentWorkOnRoot` 作为 `SchedulerCallback`

```js
export function scheduleCallback(
  reactPriorityLevel: ReactPriorityLevel,
  callback: SchedulerCallback,
  options: SchedulerCallbackOptions | void | null,
) {
  const priorityLevel = reactPriorityToSchedulerPriority(reactPriorityLevel);
  return Scheduler_scheduleCallback(priorityLevel, callback, options);
}
```

不管同步调度还是异步调度，都会经过 `Scheduler_scheduleCallback` 也就是调度的核心方法 `function unstable_scheduleCallback(priorityLevel, callback, options)`，它们会有各自的 `SchedulerCallback`

小提示：由于下面很多代码中会使用 `peek`，先插一段 `peek` 实现，其实就是返回数组中的第一个 或者 null

[peek 相关源码文件](https://github.com/facebook/react/blob/e706721490e50d0bd6af2cd933dbf857fd8b61ed/packages/scheduler/src/SchedulerMinHeap.js)

```js
  export function peek(heap: Heap): Node | null {
    const first = heap[0];
    return first === undefined ? null : first;
  }
```

下面是 `Scheduler_scheduleCallback` 相关源码

[源码文件]（https://github.com/facebook/react/blob/a152827ef697c55f89926f9b6b7aa436f1c0504e/packages/scheduler/src/Scheduler.js）


```js
// 将一个任务推入任务调度队列
function unstable_scheduleCallback(priorityLevel, callback, options) {
  var currentTime = getCurrentTime();

  var startTime;
  var timeout;
  if (typeof options === 'object' && options !== null) {
    var delay = options.delay;
    if (typeof delay === 'number' && delay > 0) {
      startTime = currentTime + delay;
    } else {
      startTime = currentTime;
    } 
    timeout =
      typeof options.timeout === 'number'
        ? options.timeout
        : timeoutForPriorityLevel(priorityLevel);
  } else {
    // 针对不同的优先级算出不同的过期时间
    timeout = timeoutForPriorityLevel(priorityLevel);
    startTime = currentTime;
  }
  
   // 定义新的过期时间
  var expirationTime = startTime + timeout;

  // 定义一个新的任务
  var newTask = {
    id: taskIdCounter++,
    callback,
    priorityLevel,
    startTime,
    expirationTime,
    sortIndex: -1,
  };
  if (enableProfiling) {
    newTask.isQueued = false;
  }

  if (startTime > currentTime) {
    // This is a delayed task.
    newTask.sortIndex = startTime;

    // 将超时的任务推入超时队列
    push(timerQueue, newTask);
    if (peek(taskQueue) === null && newTask === peek(timerQueue)) {
      // All tasks are delayed, and this is the task with the earliest delay.
      // 当所有任务都延迟时，而且该任务是最早的任务
      if (isHostTimeoutScheduled) {
        // Cancel an existing timeout.
        cancelHostTimeout();
      } else {
        isHostTimeoutScheduled = true;
      }
      // Schedule a timeout.
      requestHostTimeout(handleTimeout, startTime - currentTime);
    }
  } else {
    newTask.sortIndex = expirationTime;

    // 将新的任务推入任务队列
    push(taskQueue, newTask);
    if (enableProfiling) {
      markTaskStart(newTask, currentTime);
      newTask.isQueued = true;
    }
    // Schedule a host callback, if needed. If we're already performing work,
    // wait until the next time we yield.
    // 执行回调方法，如果已经再工作需要等待一次回调的完成
    if (!isHostCallbackScheduled && !isPerformingWork) {
      isHostCallbackScheduled = true;
        (flushWork);
    }
  }

  return newTask;
}
```

小提示: `markTaskStart` 主要起到记录的功能，对应的是 `markTaskCompleted`

[源码文件](https://github.com/facebook/react/blob/2325375f4faaa77db6671e914da5220a879a1da8/packages/scheduler/src/SchedulerProfiling.js)

```js
export function markTaskStart(
  task: {
    id: number,
    priorityLevel: PriorityLevel,
    ...
  },
  ms: number,
) {
  if (enableProfiling) {
    profilingState[QUEUE_SIZE]++;

    if (eventLog !== null) {
      // performance.now returns a float, representing milliseconds. When the
      // event is logged, it's coerced to an int. Convert to microseconds to
      // maintain extra degrees of precision.
      logEvent([TaskStartEvent, ms * 1000, task.id, task.priorityLevel]);
    }
  }
}

export function markTaskCompleted(
  task: {
    id: number,
    priorityLevel: PriorityLevel,
    ...
  },
  ms: number,
) {
  if (enableProfiling) {
    profilingState[PRIORITY] = NoPriority;
    profilingState[CURRENT_TASK_ID] = 0;
    profilingState[QUEUE_SIZE]--;

    if (eventLog !== null) {
      logEvent([TaskCompleteEvent, ms * 1000, task.id]);
    }
  }
}
```

`unstable_scheduleCallback` 主要做了几件事
* 通过 `options.delay` 和 `options.timeout` 加上 `timeoutForPriorityLevel()` 来获得 `newTask` 的 `expirationTime`
* 如果任务已过期
  * 将超时任务推入超时队列
  * 如果所有任务都延迟时，而且该任务是最早的任务，会调用 `cancelHostTimeout`
  * 调用 `requestHostTimeout`
* 将新任务推入任务队列

[源码文件](https://github.com/facebook/react/blob/2325375f4faaa77db6671e914da5220a879a1da8/packages/scheduler/src/Scheduler.js)

补上 `cancelHostTimeout` 源码

```js
  cancelHostTimeout = function() {
    clearTimeout(_timeoutID);
  };
```

再补上 `requestHostTimeout` 源码
```js
  requestHostTimeout = function(cb, ms) {
    _timeoutID = setTimeout(cb, ms);
  };
```

然后 `requestHostTimeout` 的 `cb` 也就是 `handleTimeout` 是啥呢？

```js
  function handleTimeout(currentTime) {
    isHostTimeoutScheduled = false;
    advanceTimers(currentTime);

    if (!isHostCallbackScheduled) {
      if (peek(taskQueue) !== null) {
        isHostCallbackScheduled = true;
        requestHostCallback(flushWork);
      } else {
        const firstTimer = peek(timerQueue);
        if (firstTimer !== null) {
          requestHostTimeout(handleTimeout, firstTimer.startTime - currentTime);
        }
      }
    }
  }
```

上面这个方法很重要，它主要做了下面几件事

1. 调用 `advanceTimers` 检查不再延迟的任务，并将其添加到队列中。

下面是 `advanceTimers` 源码

```js
function advanceTimers(currentTime) {
  // Check for tasks that are no longer delayed and add them to the queue.
  let timer = peek(timerQueue);
  while (timer !== null) {
    if (timer.callback === null) {
      // Timer was cancelled.
      pop(timerQueue);
    } else if (timer.startTime <= currentTime) {
      // Timer fired. Transfer to the task queue.
      pop(timerQueue);
      timer.sortIndex = timer.expirationTime;
      push(taskQueue, timer);
      if (enableProfiling) {
        markTaskStart(timer, currentTime);
        timer.isQueued = true;
      }
    } else {
      // Remaining timers are pending.
      return;
    }
    timer = peek(timerQueue);
  }
}
```

2. 调用 `requestHostCallback` 通过 `MessageChannel` 的异步方法来开启任务调度 `performWorkUntilDeadline`

`requestHostCallback` 这个方法特别重要

[源码文件](https://github.com/facebook/react/blob/3e94bce765d355d74f6a60feb4addb6d196e3482/packages/scheduler/src/forks/SchedulerHostConfig.default.js)

```js
// 通过onmessage 调用 performWorkUntilDeadline 方法
channel.port1.onmessage = performWorkUntilDeadline;

// postMessage
requestHostCallback = function(callback) {
  scheduledHostCallback = callback;
  if (!isMessageLoopRunning) {
    isMessageLoopRunning = true;
    port.postMessage(null);
  }
};
```

然后是同文件下的 `performWorkUntilDeadline`，调用了 `scheduledHostCallback`, 也就是之前传入的 `flushWork` 

```js

const performWorkUntilDeadline = () => {
  if (scheduledHostCallback !== null) {
    const currentTime = getCurrentTime();
    // Yield after `yieldInterval` ms, regardless of where we are in the vsync
    // cycle. This means there's always time remaining at the beginning of
    // the message event.
    deadline = currentTime + yieldInterval;
    const hasTimeRemaining = true;
    try {
      const hasMoreWork = scheduledHostCallback(
        hasTimeRemaining,
        currentTime,
      );
      if (!hasMoreWork) {
        isMessageLoopRunning = false;
        scheduledHostCallback = null;
      } else {
        // If there's more work, schedule the next message event at the end
        // of the preceding one.
        port.postMessage(null);
      }
    } catch (error) {
      // If a scheduler task throws, exit the current browser task so the
      // error can be observed.
      port.postMessage(null);
      throw error;
    }
  } else {
    isMessageLoopRunning = false;
  }
  // Yielding to the browser will give it a chance to paint, so we can
  // reset this.
  needsPaint = false;
};
```

`flushWork` 主要的作用是调用 `workLoop` 去循环执行所有的任务

[源码文件](https://github.com/facebook/react/blob/2325375f4faaa77db6671e914da5220a879a1da8/packages/scheduler/src/Scheduler.js)

```js
function flushWork(hasTimeRemaining, initialTime) {
  if (enableProfiling) {
    markSchedulerUnsuspended(initialTime);
  }

  // We'll need a host callback the next time work is scheduled.
  isHostCallbackScheduled = false;
  if (isHostTimeoutScheduled) {
    // We scheduled a timeout but it's no longer needed. Cancel it.
    isHostTimeoutScheduled = false;
    cancelHostTimeout();
  }

  isPerformingWork = true;
  const previousPriorityLevel = currentPriorityLevel;
  try {
    if (enableProfiling) {
      try {
        return workLoop(hasTimeRemaining, initialTime);
      } catch (error) {
        if (currentTask !== null) {
          const currentTime = getCurrentTime();
          markTaskErrored(currentTask, currentTime);
          currentTask.isQueued = false;
        }
        throw error;
      }
    } else {
      // No catch in prod codepath.
      return workLoop(hasTimeRemaining, initialTime);
    }
  } finally {
    currentTask = null;
    currentPriorityLevel = previousPriorityLevel;
    isPerformingWork = false;
    if (enableProfiling) {
      const currentTime = getCurrentTime();
      markSchedulerSuspended(currentTime);
    }
  }
}
```

`workLoop` 和 `flushWork` 在一个文件中，作用是从调度任务队列中取出优先级最高的任务，然后去执行。

还记得上文讲的 `SchedulerCallback` 吗？

* 对于同步任务执行的是 `performSyncWorkOnRoot`
* 对于异步的任务执行的是 `performConcurrentWorkOnRoot`

```js
function workLoop(hasTimeRemaining, initialTime) {
  let currentTime = initialTime;
  advanceTimers(currentTime);
  currentTask = peek(taskQueue);
  while (
    currentTask !== null &&
    !(enableSchedulerDebugging && isSchedulerPaused)
  ) {
    if (
      currentTask.expirationTime > currentTime &&
      (!hasTimeRemaining || shouldYieldToHost())
    ) {
      // This currentTask hasn't expired, and we've reached the deadline.
      break;
    }
    const callback = currentTask.callback;
    if (callback !== null) {
      currentTask.callback = null;
      currentPriorityLevel = currentTask.priorityLevel;
      const didUserCallbackTimeout = currentTask.expirationTime <= currentTime;
      markTaskRun(currentTask, currentTime);
      const continuationCallback = callback(didUserCallbackTimeout);
      currentTime = getCurrentTime();
      if (typeof continuationCallback === 'function') {
        currentTask.callback = continuationCallback;
        markTaskYield(currentTask, currentTime);
      } else {
        if (enableProfiling) {
          markTaskCompleted(currentTask, currentTime);
          currentTask.isQueued = false;
        }
        if (currentTask === peek(taskQueue)) {
          pop(taskQueue);
        }
      }
      advanceTimers(currentTime);
    } else {
      pop(taskQueue);
    }
    currentTask = peek(taskQueue);
  }
  // Return whether there's additional work
  if (currentTask !== null) {
    return true;
  } else {
    const firstTimer = peek(timerQueue);
    if (firstTimer !== null) {
      requestHostTimeout(handleTimeout, firstTimer.startTime - currentTime);
    }
    return false;
  }
}
```

最终都会通过 `performUnitOfWork` 操作。

这个方法只不过异步的方法是可以打断的，我们每次调用都要查看是否超时。

 [源码文件](https://github.com/facebook/react/blob/142d4f1c00c66f3d728177082dbc027fd6335115/packages/react-reconciler/src/ReactFiberWorkLoop.old.js)

```js
function performUnitOfWork(unitOfWork: Fiber): void {
  // The current, flushed, state of this fiber is the alternate. Ideally
  // nothing should rely on this, but relying on it here means that we don't
  // need an additional field on the work in progress.
  const current = unitOfWork.alternate;
  setCurrentDebugFiberInDEV(unitOfWork);

  let next;
  if (enableProfilerTimer && (unitOfWork.mode & ProfileMode) !== NoMode) {
    startProfilerTimer(unitOfWork);
    next = beginWork(current, unitOfWork, renderExpirationTime);
    stopProfilerTimerIfRunningAndRecordDelta(unitOfWork, true);
  } else {
    next = beginWork(current, unitOfWork, renderExpirationTime);
  }

  resetCurrentDebugFiberInDEV();
  unitOfWork.memoizedProps = unitOfWork.pendingProps;
  if (next === null) {
    // If this doesn't spawn new work, complete the current work.
    completeUnitOfWork(unitOfWork);
  } else {
    workInProgress = next;
  }

  ReactCurrentOwner.current = null;
}
```

上面的 `startProfilerTimer` 和 `stopProfilerTimerIfRunningAndRecordDelta` 其实就是记录 fiber 的工作时长。

[源码文件](https://github.com/facebook/react/blob/a30a1c6ef3a621a57e9372c8249439dbfd9a7375/packages/react-reconciler/src/ReactProfilerTimer.old.js)

```js
function startProfilerTimer(fiber: Fiber): void {
  if (!enableProfilerTimer) {
    return;
  }

  profilerStartTime = now();

  if (((fiber.actualStartTime: any): number) < 0) {
    fiber.actualStartTime = now();
  }
}

function stopProfilerTimerIfRunningAndRecordDelta(
  fiber: Fiber,
  overrideBaseTime: boolean,
): void {
  if (!enableProfilerTimer) {
    return;
  }

  if (profilerStartTime >= 0) {
    const elapsedTime = now() - profilerStartTime;
    fiber.actualDuration += elapsedTime;
    if (overrideBaseTime) {
      fiber.selfBaseDuration = elapsedTime;
    }
    profilerStartTime = -1;
  }
}
```

最后，就到了 `beginWork` 流程了 - -。里面有什么呢？ `workInProgress` 还有一大堆的 `switch case`。

想看 `beginWork` 源码的可以自行尝试 [beginWork相关源码文件](https://github.com/facebook/react/blob/142d4f1c00c66f3d728177082dbc027fd6335115/packages/react-reconciler/src/ReactFiberBeginWork.old.js)


### 总结

最后是总结部分，该不该写这个想了很久，每个读者在不同时间不同心境下看源码的感悟应该是不一样的（当然自己回顾的时候也是读者）。每次看应该都有每个时期的总结。

但是如果不写总结，这篇解析又感觉枯燥无味，且没有结果。所以简单略过一下（肯定是原创啦，别的地方没有的）

1. fiber其实就是一个节点，是链表的遍历形式
2. fiber 通过优先级计算 `expirationTime` 得到过期时间
3. 因为链表结构所以时间切片可以做到很方便的中断和恢复
4. 时间切片的实现是通过 `settimeout` + `postMessage` 实现的
5. 当所有任务都延迟时会执行 `clearTimeout`
6. 任务数 和 工作时间的计算


### Fiber 为什么要使用链表

使用链表结构只是一个结果，而不是目的，React 开发者一开始的目的是冲着模拟调用栈去的

调用栈最经常被用于存放子程序的返回地址。在调用任何子程序时，主程序都必须暂存子程序运行完毕后应该返回到的地址。因此，如果被调用的子程序还要调用其他的子程序，其自身的返回地址就必须存入调用栈，在其自身运行完毕后再行取回。除了返回地址，还会保存本地变量、函数参数、环境传递。

因此 Fiber 对象被设计成一个链表结构，通过以下主要属性组成一个链表

* `type` 类型
* `return` 存储当前节点的父节点
* `child` 存储第一个子节点
* `sibling` 存储右边第一个的兄弟节点
* `alternate` 旧树的同等节点

我们在遍历 dom 树 diff 的时候，即使中断了，我们只需要记住中断时候的那么一个节点，就可以在下个时间片恢复继续遍历并 diff。这就是 fiber 数据结构选用链表的一大好处。


### 时间切片为什么不用 requestIdleCallback

浏览器个周期执行的事件

```
  1. 宏任务
  2. 微任务
  4. requestAnimationFrame
  5. IntersectionObserver
  6. 更新界面
  7. requestIdleCallback
  8. 下一帧
```

根据[官方]([requestIdleCallback](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/requestIdleCallback))描述: 

> `window.requestIdleCallback()` 方法将在浏览器的空闲时段内调用的函数排队。这使开发者能够在主事件循环上执行后台和低优先级工作，而不会影响延迟关键事件，如动画和输入响应。函数一般会按先进先调用的顺序执行，然而，如果回调函数指定了执行超时时间 `timeout`，则有可能为了在超时前执行函数而打乱执行顺序。
> 你可以在空闲回调函数中调用 `requestIdleCallback()`，以便在下一次通过事件循环之前调度另一个回调。


看似完美契合时间切片的思想，所以起初 React 的时间分片渲染就想要用到这个 API，不过目前浏览器支持的不给力，而且 `requestIdleCallback` 有点过于严格，并且执行频率不足以实现流畅的UI呈现。

而且我们希望通过Fiber 架构，让 `reconcilation` 过程变成可被中断。'适时'地让出 CPU 执行权。因此React团队不得不实现自己的版本。

实际上 Fiber 的思想和协程的概念是契合的。举个栗子：
 
普通函数: （无法被中断和恢复）

```js
const tasks = []
function run() {
  let task
  while (task = tasks.shift()) {
    execute(task)
  }
}
```

如果使用 `Generator` 语法:

```js
const tasks = []
function * run() {
  let task

  while (task = tasks.shift()) {
    // 判断是否有高优先级事件需要处理, 有的话让出控制权
    if (hasHighPriorityEvent()) {
      yield
    }

    // 处理完高优先级事件后，恢复函数调用栈，继续执行...
    execute(task)
  }
}
```

但是 React 尝试过用 Generator 实现，后来发现很麻烦，就放弃了。


### 为什么时间切片不使用 Generator

主要是2个原因：

1. `Generator` 必须将每个函数都包装在 Generator 堆栈中。这不仅增加了很多语法开销，而且还增加了现有实现中的运行时开销。虽然有胜于无，但是性能问题仍然存在。
2. 最大的原因是生成器是有状态的。无法在其中途恢复。如果你要恢复递归现场，可能需要从头开始, 恢复到之前的调用栈。


### 时间切片为什么不使用 Web Workers

是否可以通过 `Web Worker` 来创建多线程环境来实现时间切片呢？

React 团队也曾经考虑过，尝试提出共享的不可变持久数据结构，尝试了自定义 VM 调整等，但是 `JavaScript` 该语言不适用于此。

因为可变的共享运行时（例如原型），生态系统还没有做好准备，因为你必须跨工作人员重复代码加载和模块初始化。如果垃圾回收器必须是线程安全的，则它们的效率不如当前高效，并且VM实现者似乎不愿意承担持久数据结构的实现成本。共享的可变类型数组似乎正在发展，但是在当今的生态系统中，要求所有数据通过此层似乎是不可行的。代码库的不同部分之间的人为边界也无法很好地工作，并且会带来不必要的摩擦。即使那样，你仍然有很多JS代码（例如实用程序库）必须在工作人员之间复制。这会导致启动时间和内存开销变慢。因此，是的，在我们可以定位诸如Web Assembly之类的东西之前，线程可能是不可能的。

你无法安全地中止后台线程。中止和重启线程并不是很便宜。在许多语言中，它也不安全，因为你可能处于一些懒惰的初始化工作之中。即使它被有效地中断了，你也必须继续在它上面花费CPU周期。

另一个限制是，由于无法立即中止线程，因此无法确定两个线程是否同时处理同一组件。这导致了一些限制，例如无法支持有状态的类实例（如React.Component）。线程不能只记住你在一个线程中完成的部分工作并在另一个线程中重复使用。


ps: 本菜不会用 React，第一次读 React 源码，对源码有误读请指正