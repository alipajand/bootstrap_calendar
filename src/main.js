import Vue from 'vue';
import App from './App';
import router from './router';

import '../filters';
import '../plugins';
import 'jquery/src/jquery';

import './styles/bootstrap.scss';

const production = process.env.NODE_ENV !== 'production';
Vue.config.performance = !production;
Vue.config.productionTip = !production;
Vue.config.devtools = !production;
Vue.config.silent = production;

window.vueApp = new Vue({
  router,
  render: h => h(App)
}).$mount('#app');
