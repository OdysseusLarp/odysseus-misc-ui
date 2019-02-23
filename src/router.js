import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import HangarBayDoor from './views/HangarBayDoor'
import TaskListView from './views/TaskListView'

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
    {
      path: '/tasks',
      name: 'tasks',
      component: TaskListView,
    },
  ],
});
