import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
//引入Element
import ElementUI from 'element-ui'
import { Button } from 'vant'
import '../node_modules/element-ui/lib/theme-chalk/index.css'
Vue.config.productionTip = false
Vue.use(ElementUI)
Vue.use(Button)
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')