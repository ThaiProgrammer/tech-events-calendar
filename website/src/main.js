import 'whatwg-fetch'
import 'vue-octicon/icons/calendar'
import 'vue-octicon/icons/clock'
import 'vue-octicon/icons/location'
import Vue from 'vue'
import VueAnalytics from 'vue-analytics'

import './primer.scss'
import App from './App'
import router from './router'
import store from './store'

Vue.use(VueAnalytics, {
  id: 'UA-59441941-4',
  router
})

document.querySelector('#loading').style.display = 'none'

Vue.config.productionTip = false

/* eslint-disable no-new */
const app = new Vue({
  el: '#app',
  router,
  store,
  created() {
    this.$store.dispatch('load')
  },
  render: h => h(App)
})

Object.assign(window, { app, store })
