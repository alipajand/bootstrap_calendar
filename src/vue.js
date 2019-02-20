// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import router from './router';

import BootstrapVue from 'bootstrap-vue'; // https://github.com/bootstrap-vue/bootstrap-vue

/**
 * Bootstrap vue
 */
Vue.use(BootstrapVue);

Vue.config.performance = false;
Vue.config.productionTip = false;

new Vue({
    el: '#app',
    router,
    components: { App },
    template: '<App/>'
});
