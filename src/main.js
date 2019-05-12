import Vue from "vue"
import App from "./App.vue"
import router from "./router"
import Antd from "ant-design-vue"
import "ant-design-vue/dist/antd.min.css"
import VueApollo from "vue-apollo"
import apolloClient from './apollo/ApolloClient'

const apolloProvider = new VueApollo({
  defaultClient: apolloClient
})

Vue.config.productionTip = false;
Vue.use(Antd)
Vue.use(VueApollo)
new Vue({
  router,
  apolloProvider,
  render: h => h(App)
}).$mount("#app");
