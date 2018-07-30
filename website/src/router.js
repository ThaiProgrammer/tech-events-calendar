import Router from 'vue-router'
import Vue from 'vue'

import EventInfoPage from './components/EventInfoPage'
import HomePage from './components/HomePage'
import ListPage from './components/ListPage'
import AdminPage from './components/AdminPage'

Vue.use(Router)

export default new Router({
  mode: 'history',
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    }
    return { x: 0, y: 0 }
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
      path: '/editor',
      name: 'DataEditorPage',
      component: () =>
        import(/* webpackChunkName: "data-generator" */ './components/DataEditorPage')
    },
    {
      path: '/admin',
      name: 'AdminPage',
      component: AdminPage
    },
    {
      path: '/event/:id',
      name: 'EventInfoPage',
      component: EventInfoPage
    }
  ]
})
