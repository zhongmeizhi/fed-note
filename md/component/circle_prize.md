# 原形抽奖功能


![33](/md/img/component/33.png)

## 构思

1. 奖励物品是通过接口获取的（img）
2. 奖励结果是通过接口获取的（id）
3. 抽奖的动画需要由慢到快再到慢
4. 抽奖转动时间不能太短
6. 抽奖结束需要回调
7. 业务代码和功能代码要分离


## 先完成一个 UI

使用 flex 来布局，easy，当 `curGameIdx` 等于当前奖品 `index` 时高亮

html
```html
    <div class="game-box">
        <template
        v-for="(val, idx) of boundList">
        <div v-if="idx == 4" class="game-item game-begin" 
            :key="idx"
            @click="beginGame">
            开始游戏
        </div>
        <div v-else :key="idx"
            class="game-item"
            :class="{
            active: idx === curGameIdx
            }">
            {{val}}
        </div>
        </template>
    </div>
```

css
```css
    .game-box {
        display: flex;
        flex-wrap: wrap;
        text-align: center;
        .game-item {
            width: 1.25rem;
            height: 0.3rem;
            background: yellow;
            border: 1px solid transparent;
            transition: all 0.2s;
            &.game-begin {
                background: transparent;
            }
            &.active {
                border: 1px solid black;
            }
        }
    }
```

效果图
![11](/md/img/component/11.png)


## 开始做动画效果

新建一个 `Game` 的 `class`，有有个 `run` 方法和 `finish` 方法

### 开始运行

动画的速度是变化的，使用 `requestAnimationFrame` 和 `setInterval` 有点不妥，所以：可以使用 `setTimeout` + `speed 参数` 来控制动画的速度。

```js
class Game {
    constructor(idx) {
        this.idx = idx;
        this.speed = 400;
    }

    addIdx(){
    }

    speedControl() {
    }

    finish() {
    }

    run(cb) {
        this.addIdx();
        this.speedControl();
        setTimeout(() => {
            !this.isFinish && this.run(cb);
        }, this.speed);
    }
}
```

### 结束运行

收到结束运行的通知时，需要先做减速动画，然后再停止在对应的 `num`，然后调用回调函数，所以先暂存结束回调和结束点，并将动画设置为减速。

```js
    finish(num, finishCb) {
        this.oil = false;
        this.endIdx = num;
        this.finishCb = finishCb;
    }
```


### 速度的控制

1. 默认速度为加速（`this.oil = true`）通过是否达到预期速度来停止加速，当减速时同理。
2. 为达到缓动结束效果，所以结束时间通过：到达最小速度 且 到达结束位置。

```js
    speedUp() {
        this.speed -= 60;
    }

    speedDown() {
        this.speed += 200;
    }

    speedControl() {    
        if (this.speed > this.Max_Speed) {
            if (this.oil) {
                this.speedUp();
            }
        }
        if (!this.oil) {
            if (this.speed < this.Min_Speed) {
                this.speedDown();
            } else if (this.endIdx === this.idx) {
                this.isFinish = true;
                typeof this.finishCb === 'function' && this.finishCb();
            }
        }
    }
```

### index 矫正

此时，上面 UI 是通过 `v-for` + `flex` 展示的，而动画的执行是转圈，所以需要矫正 `index`

更改上面 `addIdx` 方法，矫正 index，并将 `++index` 取余
```js
    constructor(idx) {
        this.idx = idx;
        this.speed = 400;
        this.order = null;
        this.Order_List = [0,1,2,5,8,7,6,3];
        this.Game_Box_Num = 8;
    }

    addIdx() {
        this.idx = (++this.idx % this.Game_Box_Num);
        this.order = this.Order_List[this.idx];
    }
```

### 活动代码与业务代码互动

将需要交互的函数传递给 `Game` 的实例即可
```js
  // vue 代码
  methods: {
    updateGameIdx(order) {
      this.curGameIdx = order; 
    },
    gameFinish() {
      this.playing = false;
      console.log(this.curGameIdx, 'curGameIdx')
    },
    beginGame() {
      if (this.playing) return;
      this.playing = true;
      this.curGameIdx = 0;
      const game = new Game(this.curGameIdx);
      game.run(this.updateGameIdx);
      // 通过请求终止
      setTimeout(() => {
        game.finish(2, this.gameFinish)
      }, 3000);
    }
  }
```

### 最后附上完整 Game 代码：

```js
class Game {
  constructor(idx) {
    this.idx = idx;
    this.speed = 400;
    this.oil = true;
    this.isFinish = false;
    this.endIdx = null;
    this.finishCb = function() {}
    // 常量
    this.Max_Speed = 100;
    this.Min_Speed = 500;
    this.Order_List = [0,1,2,5,8,7,6,3];
    this.Game_Box_Num = 8;
  }

  speedUp() {
    this.speed -= 60;
  }

  speedDown() {
    this.speed += 200;
  }

  speedControl() {
    if (this.speed > this.Max_Speed) {
      if (this.oil) {
        this.speedUp();
      }
    }
    if (!this.oil) {
      if (this.speed < this.Min_Speed) {
        this.speedDown();
      } else if (this.endIdx === this.idx) {
        this.isFinish = true;
        typeof this.finishCb === 'function' && this.finishCb();
      }
    }
  }

  finish(num, finishCb) {
    this.oil = false;
    this.endIdx = num;
    this.finishCb = finishCb;
  }

  addIdx() {
    this.idx = (++this.idx % this.Game_Box_Num);
  }

  run(cb) {
    this.addIdx();
    typeof cb === 'function' && cb(this.Order_List[this.idx]);
    this.speedControl();
    setTimeout(() => {
      !this.isFinish && this.run(cb);
    }, this.speed);
  }
}

export default Game;

```

### 大致效果

![22](/md/img/component/22.gif)

主要功能已经实现，想漂亮点再改改 CSS 就好了，动画时间也需要再调试。
