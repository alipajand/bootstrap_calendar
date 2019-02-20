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
    ],

    /**
     * Scroll to top after router changed
     */
    scrollBehavior(to, from, savedPosition) {
        if (savedPosition) {
            return savedPosition;
        } else {
            return { x: 0, y: 0 };
        }
    }
});
