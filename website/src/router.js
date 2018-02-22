import HomePage from './components/HomePage'
import ListPage from './components/ListPage'
import Router from 'vue-router'
import Vue from 'vue'

Vue.use(Router)

export default new Router({
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
    }
  ]
})
