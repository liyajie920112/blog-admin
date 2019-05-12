import Vue from "vue"
import Router from "vue-router"
import Home from "./views/Home.vue"
import Index from "./views/Index"
import Login from "./views/Login"

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [{
      path: "/",
      redirect: '/manager/index'
    },
    {
      path: "/manager/index",
      name: 'manager',
      component: Index
    },
    {
      path: "/manager/login",
      name: 'login',
      component: Login
    },
    {
      path: "/about",
      name: "about",
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () =>
        import( /* webpackChunkName: "about" */ "./views/About.vue")
    }
  ]
});