import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import HangarBayDoor from './views/HangarBayDoor'

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
    },
    {
      path: '/hangarbaydoor',
      name: 'hangarbaydoor',
      component: HangarBayDoor,
    },
  ],
});
