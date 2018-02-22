import EventInfoPage from './components/EventInfoPage'
import HomePage from './components/HomePage'
import ListPage from './components/ListPage'
import Router from 'vue-router'
import Vue from 'vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  scrollBehavior (to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { x: 0, y: 0 }
    }
  },
  routes: [
    {
      path: '/',
      name: 'HomePage',
      component: HomePage
    },
    {
      path: '/list',
      name: 'ListPage',
      component: ListPage
    },
    {
      path: '/event/:id',
      name: 'EventInfoPage',
      component: EventInfoPage
    }
  ]
})
