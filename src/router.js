import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import Index from './views/Index'
import Login from './views/Login'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [{
      path: '/',
      redirect: '/manager'
    },
    {
      path: '/manager',
      component: () => import( /* webpackChunkName: 'layout' */ './views/Layout.vue'),
      children: [{
        path: '',
        component: () => import( /* webpackChunkName: 'layout' */ './views/Index.vue')        
      },{
        path: 'editor/:id',
        name: 'editor',
        component: () => import( /* webpackChunkName: 'editor' */ './views/Editor.vue')
      }]
    },
    {
      path: '/manager/login',
      name: 'login',
      component: () => import( /* webpackChunkName: 'login' */ './views/Login.vue')
    }
  ]
});