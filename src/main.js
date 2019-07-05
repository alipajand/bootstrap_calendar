import Vue from 'vue';
import App from './App';

import '../plugins';

window.vueApp = new Vue({
  render: h => h(App)
}).$mount('#app');
