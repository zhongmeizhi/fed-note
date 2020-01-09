# 可插拔式 组件设计

从一个 `Confirm` 组件开始，一步步写一个可插拔式的组件。

处理一个正常的支付流程（比如支付宝购买基金）
1. 点击购买按钮
2. 如果风险等级不匹配则：弹确认框（Confirm）
3. 用户确认风险后：弹出支付方式选择弹窗（Dialog）
4. 选择好支付方式后：弹窗调用指纹验证（Dialog）
5. 如果关闭指纹验证：提示是否输入密码（Dialog）
6. 弹出输入密码的键盘（自定义键盘）
7. 当然还有密码加班
8. 如果密码输入错误则弹出修改/重试提示（Confirm）
9. ...再次弹出键盘

大约6个弹窗...

## 地摊货（精简版）

首先尝试以一个平常的注册组件实现

`Confirm` 通过 `v-model="isShow"` 切换展示，通过 `@onConfirm` 和 `onCancel` 接收点击事件。

组件代码
```
    <template>
        <div v-if="value">
            <slot></slot>
            <div>
                <div @click="cancelHandler">{{cancelTxt}}</div>
                <div @click="confirmHandler">{{confirmTxt}}</div>
            </div>
        </div>
    </template>

    <script>
    export default {
        props: {
            value: {
                type: Boolean,
                default: false,
            }
        },
        data() {
            return {
                content: '',
                confirmTxt: '',
                cancelTxt: '',
            }
        },
        methods: {
            close() {
                this.$emit('input');
            },
            cancelHandler() {
                this.$emit('onCancel');
            },
            confirmHandler() {
                this.$emit('onConfirm');
            }
        }
    }
    </script>
```

使用代码
```html
    <confirm
        v-model="isConfirmShow"
        @onCancel="onCancel"
        @onConfirm="onConfirm"
    >内容部分</confirm>
```

那么用它来完成上面的需求吧。

```js
    openRiskConfirm() {
        this.isRiskConfirmShow = true;
    },
    onRiskCancel() {
        this.isRiskConfirmShow = false;
    },
    onRiskConfirm() {
        // something
        this.openPaymeList();
    },
    openPaymeList() {
        this.isPaymentListShow = ture;
    }
    // ... 巴拉巴拉
    // ... 大约需要 3*6 = 18 个方法才能完成需求（其他请求类的还不算）
```

如果你能接受，但是：

那么万一监管放松了，不需要校验风险了呢？或者一开始没有校验风险，监管突然要校验风险了呢？又或者不在 `app` 上使用，不用调用指纹呢？又或者要添加一个 人脸识别功能了呢？

代码改起来会是一个灾难，因为就算业务代码是你写的，你一段时间后也不一定能记得流程，而且，代码看起来没有任何的连续性，只能一个个方法看。


## 流行款（精简版）

针对上面的业务流程，尝试使用现在比较流行的的弹窗。

组件：更改接收方法位置，从 `props` 放到 `$data` 中
```
    <template>
        <div>
            <div>{{content}}</div>
            <div>
                <div @click="cancelHandler">{{cancelTxt}}</div>
                <div @click="confirmHandler">{{confirmTxt}}</div>
            </div>
        </div>
    </template>

    <script>
    export default {
        data() {
            return {
                content: '',
                confirmTxt: '',
                cancelTxt: '',
                onConfirm: function() {},
                onCancel: function() {},
            }
        },
        methods: {
            uninstall() {
                this.$destroy(true);
                this.$el.parentNode.removeChild(this.$el);
            },
            cancelHandler() {
                (typeof this.onCancel === 'function') && this.onCancel()
                this.uninstall();
            },
            confirmHandler() {
                (typeof this.onConfirm === 'function') && this.onConfirm()
                this.uninstall();
            }
        }
    }
    </script>
```

注册到全局
```js
    import confirm from './confirm.vue'

    export default {
        install: function(Vue) {
            const Profile = Vue.extend(confirm);
            
            const PortfolioMsg = (options) => {
                let $ele = document.createElement("div");
                document.body.appendChild($ele);
                new Profile({
                    data() {
                        return options;
                    }
                }).$mount($ele);
            };

            Vue.prototype.$confirm = PortfolioMsg;
        }
    }
```

调用
```js
    this.$confirm({
        content: '内容',
        confirmTxt: '确定',
        cancelTxt: '取消',
        onConfirm: () => {
            console.log('确定')
        },
        onCancel: () => {
            console.log('取消')
        }
    })
```

哪啊么用它完成上面的需求会如何？

```js
    this.$confirm({
        content: '风险认证',
        cancelTxt: '再看看',
        confirmTxt: '同意',
        onConfirm: () => {
            // something
            this.$dialog({
                content: '指纹认证',
                slot: `<div>指纹认证</div>`,
                onFinish: () => {
                    // 支付 成功? 失败?
                    // something
                },
                onCancel: () => {
                    // something
                    this.$confirm({
                        content: '密码认证',
                        cancelTxt: '取消',
                        confirmTxt: '确定',
                        onConfirm: () => {
                            // something
                            this.$keyboard({
                                // 略
                                onFinish: (password) => {
                                    // 密码加密
                                    // something
                                    if (/* 密码错误？ */) {
                                        // 重复了
                                        // 这个代码就可以抽象成一个方法
                                        this.$confirm({
                                            content: '密码认证',
                                            cancelTxt: '取消',
                                            confirmTxt: '确定',
                                            // 略
                                        })
                                    }
                                }
                            })
                        },
                        onCancel: () => {
                            // 取消
                        }
                    })
                }
            })
        },
        onCancel: () => {
            // 取消
        }
    })
```

这样看起来确实清晰了很多，代码量也少了很多，不需要注册全局的组件可以通过在 `methods` 中封装一个方法实现，维护起来也方便了很多。但是：回调地狱有木有？也只是稍微轻松一点，可不可以再优化一下呢？

## 抽象版

ajax 的回调地狱是通过 `Promise` 实现的，那么上面的组件回调地狱是不是也可以通过 `Promise` 实现呢？

```js
import confirm from './confirm.vue'

export default {
    install: function(Vue) {
        const Profile = Vue.extend(confirm);
        
        const PortfolioMsg = (options) => {
            let $ele = document.createElement("div");
            document.body.appendChild($ele);
            const profile = new Profile({
                data() {
                    return options;
                }
            }).$mount($ele);
            
            return new Promise((resolve, reject) => {
                profile.$on('onConfirm', resolve)
                profile.$on('onCancel', reject)
            })
        };

        Vue.prototype.$confirm = PortfolioMsg;
    }
}
```

使用一下
```js
    this.$confirm({
        confirmTxt: '确定'
    }).then(res => {
        console.log('点击了确定')
    }).catch(res => {
        console.log('点击了取消')
    })
```

用来解决上面的需求呢？

那么回调地狱的问题很轻松的就解决了，可读性很高，中间添加删除逻辑也变的特别方便，维护起来成本大大的降低了。具体代码自己抽象一遍或许更好哦。

大家其他的封装方法吗？请留言哈

