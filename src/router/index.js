import Vue from 'vue';
import Router from 'vue-router';
import HomePage from '../pages/home';

Vue.use(Router);

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomePage
    }
  ]
});
