
import { reactive, effect, track, trigger } from './vue3.js'

/* 
  场景 1
*/
// const obj = reactive({ x: 1 })

// effect(() => {
//   document.body.innerText = obj.x
// })

// setTimeout(() => {
//   obj.x = 2
// }, 1000)


/* 
  场景 2
*/
var obj = {
  x: 1
}

effect(() => {
  document.body.innerText = obj.x;
  track(obj, 'get', 'x');
})

setTimeout(() => {
  obj.x = 2;
  trigger(obj, 'set', 'x')
}, 1000)
