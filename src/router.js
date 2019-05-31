import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [{
    path: '/',
    redirect: '/manager/index'
  }, {
    path: '/manager/editor/:id?',
    name: 'editor',
    component: () => import(/* webpackChunkName: 'editor' */ './views/Editor.vue')
  }, {
    path: '/manager/index',
    component: () => import(/* webpackChunkName: 'nav' */ './views/Index.vue')
  }, {
    path: '/manager/blogs',
    component: () => import(/* webpackChunkName: 'layout' */ './views/Blogs.vue')
  }, {
    path: '/manager/login',
    name: 'login',
    component: () => import(/* webpackChunkName: 'login' */ './views/Login.vue')
  }]
})
