import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './registerServiceWorker'
import './plugins/bootstrap-vue'
import './plugins/vue-fontawesome'
import axios from 'axios'
Vue.config.productionTip = false;


// Setup axios backend URI (page is reloaded if it changes)
console.log("Using backend URL: " + store.state.backend.uri)
axios.defaults.baseURL = store.state.backend.uri;
if (store.state.backend.username) {
  axios.withCredentials = true;
  axios.defaults.auth = {
    username: store.state.backend.username,
    password: store.state.backend.password
  };
}


new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');
