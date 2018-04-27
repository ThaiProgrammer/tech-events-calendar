import 'whatwg-fetch'
import './primer.scss'
import 'vue-octicon/icons/calendar'
import 'vue-octicon/icons/clock'
import 'vue-octicon/icons/location'

import App from './App'
import Vue from 'vue'
import VueAnalytics from 'vue-analytics'
import router from './router'
import store from './store'

Vue.use(VueAnalytics, {
  id: 'UA-59441941-4',
  router
})

document.querySelector('#loading').style.display = 'none'

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  created() {
    this.$store.dispatch('load')
  },
  render: h => h(App)
})
