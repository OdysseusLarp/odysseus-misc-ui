import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import HangarBayDoor from './views/HangarBayDoor'
import AirlockView from './views/AirlockView'
import TaskListView from './views/TaskListView'
import TaskDetailsView from './views/TaskDetailsView'
import TaskMapView from './views/TaskMapView'
import InfoboardView from './views/InfoboardView'

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
      path: '/airlock',
      name: 'airlock',
      component: AirlockView,
    },
    {
      path: '/tasks',
      name: 'tasks',
      component: TaskListView,
    },
    {
      path: '/taskDetails',
      name: 'taskDetails',
      component: TaskDetailsView,
    },
    {
      path: '/taskMap',
      name: 'taskMap',
      component: TaskMapView,
    },
    {
      path: '/infoboard',
      name: 'infoboard',
      component: InfoboardView,
    },
  ],
});
