// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import router from './router';

import BootstrapVue from 'bootstrap-vue'; // https://github.com/bootstrap-vue/bootstrap-vue
import PersianCalendar from './index'; // https://github.com/bootstrap-vue/bootstrap-vue

/**
 * Custom filters
 */
import './filters';

/**
 * Bootstrap vue
 */
Vue.use(BootstrapVue);

/**
 * Calendar
 */
Vue.use(PersianCalendar, {
    primaryColor: '#439687'
});

Vue.config.performance = false;
Vue.config.productionTip = false;

new Vue({
    el: '#app',
    router,
    components: { App },
    template: '<App/>'
});
