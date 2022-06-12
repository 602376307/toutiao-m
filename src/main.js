import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import 'amfe-flexible' // 引入设置根标签大小的包 移动端设配
// import hljs from 'highlight.js' // hljs对象
import 'highlight.js/styles/default.css' // 代码高亮的样式
import directiveObj from '@/utils/directive.js'
import './vant.js' // 引入vant的注册文件
Vue.config.productionTip = false

// 自定义指令 自动聚焦
// Vue.directive('fofo', {
//   inserted (el) {
//     const input = el.querySelector('input')
//     input.focus()
//   }
// })
// 也可以封装起来

Vue.use(directiveObj)
console.log(process)
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
