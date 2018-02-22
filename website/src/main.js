import './primer.scss'
import 'vue-octicon/icons/calendar'
import 'vue-octicon/icons/clock'
import 'vue-octicon/icons/location'

import App from './App'
import Vue from 'vue'
import router from './router'
import store from './store'

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App),
  created () {
    this.$store.dispatch('load')
  }
})
