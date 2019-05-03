# 实现双向绑定

> Vue的双向绑定是`利用订阅-发布者模式`+`数据劫持`实现的

在`Object.defineProperty`的getter中由Deps收集Watcher对象，在setter中notify。

简单的双向绑定实现
```
<!DOCTYPE html>
<html lang="zh">
<head>
	<meta charset="UTF-8" />
	<meta name="viewport" content="width=device-width, initial-scale=1.0" />
	<meta http-equiv="X-UA-Compatible" content="ie=edge" />
	<title>Document</title>
</head>
<body>
	
	<div id="app">
		<div>
			<input v-model="num"/>
			<p v-bind="num"></p>
		</div>
		<div>
			<button @click="addNum">
				加一次
			</button>
		</div>
	</div>
	
	<script>

		let protoToString = Object.prototype.toString;

		function isArray(value) {
			return protoToString.call(value) === '[object Array]'
		}

		class Watcher {
			constructor(node, cb, key){
				this.node = node;
				this.cb = cb;
				this.key = key;
			}

			update () {
				this.cb(this.node);
			}
		}

		// class Dep {
		// 	constructor() {
		// 	}
		// }
		
		class Vue {
			constructor({el, data, methods, render}) {
				this.$ele = document.querySelector(el);
				// x
				this.$dep = {};
				this.$data = this._obs(data);
				this.$methods = methods;
				this._compileHtml(this.$ele);
			}

			// 数据劫持
			_obs(data) {
				let _that = this
				return new Proxy(data, {
					get(target, key) {
						return target[key];
					},
					set(target, key, value) {
						let val = Reflect.set(target, key, value);
						_that.$dep[key].forEach(item => item.update());
						return val;
					}
				});
			}

      // 订阅
			_pushWatcher(watcher) {
				if (!this.$dep[watcher.key]) {
					this.$dep[watcher.key] = [];
				}
				this.$dep[watcher.key].push(watcher);
			}

			// 解析html
			_compileHtml(ele) {
				const nodes = Array.from(ele.children);
				let data = this.$data;
				for(let node of nodes) {
					let attrs = Array.from(node.attributes);
					// 判断是否input???
					if (node.getAttribute('v-model')) {
						const key = node.getAttribute('v-model');
						let cb = () => {
							node.value = this.$data[key];
						}
						cb();
						this._pushWatcher(new Watcher(node, cb, key));
						node.addEventListener('input', () => {
							data[key] = node.value;
						});
					}
					if (node.getAttribute('v-bind')) {
						const key = node.getAttribute('v-bind');
						let cb = () => {
							node.innerHTML = this.$data[key];
						}
						cb();
						this._pushWatcher(new Watcher(node, cb, key));
					}
					if (node.getAttribute('@click')) {
						const key = node.getAttribute('@click');
						node.addEventListener('click', () => {
							this.$methods[key].call(this);
						});
					}
					// 子元素递归
					if (node.children && node.children.length) {
						this._compileHtml(node);
					}
				}
			}
		}

		var app = new Vue({
			el: '#app',
			data: {
				num: 0
			},
			methods: {
				addNum() {
					this.$data.num++
				}
			}
		})
		
	</script>
</body>
</html>
```

**注意点：**
* Vue在初始化组件数据(data、props、computed、methods、events、watch)时，发生在create时期（beforeCreate与created之间）
* render(渲染)触发的是Data的getter操作（保证视图中用到的数据改变才触发后续的重新渲染）
* Vue2.0的数据劫持`Object.defineProperty`方法是无法监听`Array`变化的
  * 尤大使用了hack手法，重写了['push', 'pop', 'shift', 'unshift', 'splice', 'sort', 'reverse']，
  * 同时使用`const arrayMethods = Object.create(arrayProto)`确保不污染原生数组方法


### [返回主页](/README.md)