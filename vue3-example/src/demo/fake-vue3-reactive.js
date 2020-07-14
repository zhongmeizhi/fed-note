let targetMap = new WeakMap();
let activeEffect;

export function mount(instance, el) {
  effect(function() {
    instance.$data && update(el, instance);
  })
  instance.$data = instance.setup();
  update(el, instance);
}

function update(el, instance) {
  el.innerHTML = instance.render()
}

function effect(fn) {
  const _effect = function(...args) {
    activeEffect = _effect;
    return fn(...args);
  };
  _effect();
  return _effect;
}

export function reactive(target) {
  return new Proxy(target, {
    get(target, prop) {
      track(target, prop);
      return Reflect.get(target, prop);
    },
    set(target, prop, newVal) {
      Reflect.set(target, prop, newVal);
      trigger(target, prop);
      // 必须 return true;
      // 否则会产生警告 'set' on proxy: trap returned falsish for property 
      return true;
    }
  })
}

function track(target, key) {
  let depsMap = targetMap.get(target);
  if (!depsMap) {
		targetMap.set(target, (depsMap = new Map()));
  }
  let dep = depsMap.get(key);
	if (!dep) {
    depsMap.set(key, (dep = new Set()));
  }
  if (!dep.has(activeEffect)) {
		dep.add(activeEffect);
	}
}

function trigger(target, key) {
  const depsMap = targetMap.get(target);
  if (!depsMap) return;
  const effects = new Set()
  depsMap.get(key).forEach(e => effects.add(e))
  effects.forEach(e => e())
}