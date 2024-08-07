import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import AirlockView from './views/AirlockView'
import TaskListView from './views/TaskListView'
import TaskDetailsView from './views/TaskDetailsView'
import TaskMapView from './views/TaskMapView'
import InfoboardView from './views/InfoboardView'
import PowerSource from './views/PowerSource'
import Starfield from './views/Starfield'
import Fighterstatus from './views/Fighterstatus'

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
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
    {
      path: '/powerSource',
      name: 'powerSource',
      component: PowerSource,
    },
    {
      path: '/starfield',
      name: 'starfield',
      component: Starfield,
    },
    {
      path: '/fighterstatus',
      name: 'fighterstatus',
      component: Fighterstatus,
    },
  ],
});
