import { reactive, effect } from '../vue3.js'

/* 
  场景 1
*/
const obj = reactive({ x: 1 })

effect(() => {
  patch()
})

setTimeout(() => {
  obj.x = 2
}, 1000)

function patch() {
  document.body.innerText = obj.x
}