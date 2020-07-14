/* 
  场景 1
*/
// import './demo/reactive'

/* 
  场景 2
*/
// import './demo/effect.js'

import { mount, reactive} from './demo/fake-vue3-reactive.js'

const App = {
  $data: null,
  setup () {
    let count = reactive({ num: 0 })
    setInterval(() => {
      count.num += 1;
    }, 1000);

    return {
      count
    };
  },
  render() {
    return `<button>${this.$data.count.num}</button>`
  }
}

mount(App, document.body)
