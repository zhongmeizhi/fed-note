import { effect, track, trigger, targetMap } from '../vue3.js'
/* 
  场景 2
*/
var obj = {
  x: 1
}
var obj2 = {
  y: 1
}

effect(() => {
  patch();
  track(obj, 'get', 'x');
  track(obj2, 'get', 'y');
  console.log(targetMap, 'targetMap')
})

setTimeout(() => {
  obj.x = 2;
  trigger(obj, 'set', 'x')
}, 1000)

function patch() {
  document.body.innerText = obj.x
}