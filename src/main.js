import Vue from 'vue'
import App from './App.vue'
import store from './store'


Vue.config.productionTip = false

import './scss/main.scss'

import fonts from './utils/fonts';
Vue.use(fonts);

import filters from './utils/filters';
Vue.use(filters);

new Vue({
  store,
  render: h => h(App)
}).$mount('#app')
