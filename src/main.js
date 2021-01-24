import Vue from 'vue'
import App from './App.vue'
import VueResource from 'vue-resource'
import router from './router'
import store from './store'

import './filters'

Vue.config.productionTip = false

Vue.use(VueResource)

new Vue({
  router,
  store,
  render: function (h) { return h(App) }
}).$mount('#app')
