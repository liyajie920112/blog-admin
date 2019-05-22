import Vue from 'vue'
import App from './App.vue'
import router from './router'
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/antd.min.css'
import './static/reset.less'
import VueApollo from 'vue-apollo'
import apolloClient from './apollo/ApolloClient'
import apolloUploadClient from './apollo/ApolloUploadClient'

const apolloProvider = new VueApollo({
  clients: {
    upload: apolloUploadClient
  },
  defaultClient: apolloClient
})

Vue.config.productionTip = false;
Vue.use(Antd)
Vue.use(VueApollo)
new Vue({
  router,
  apolloProvider,
  render: h => h(App)
}).$mount('#app')
