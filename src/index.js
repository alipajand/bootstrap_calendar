import * as componentPlugins from './components';
import { vueUse } from './utils/plugins';

const VuePlugin = {
    install: function (Vue) {
        if (Vue._bootstrap_vue_installed) {
            return;
        }

        Vue._bootstrap_vue_installed = true;

        // Register component plugins
        for (let plugin in componentPlugins) {
            Vue.use(componentPlugins[plugin]);
        }
    }
};

vueUse(VuePlugin);

export default VuePlugin;
