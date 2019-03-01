/**
 * Register a component plugin as being loaded. returns true if component plugin already registered
 * @param Vue
 * @param name
 * @param def
 * @returns {*}
 */
export function registerComponent(Vue, name, def) {
    Vue._bootstrap_vue_components_ = Vue._bootstrap_vue_components_ || {};
    const loaded = Vue._bootstrap_vue_components_[name];
    if (!loaded && def && name) {
        Vue._bootstrap_vue_components_[name] = true;
        Vue.component(name, def);
    }
    return loaded;
}

/**
 * Register a group of components as being loaded.
 * @param Vue
 * @param components
 */
export function registerComponents(Vue, components) {
    for (const component in components) {
        if (components.hasOwnProperty(component)) {
            registerComponent(Vue, component, components[component]);
        }
    }
}

/**
 * Register a directive as being loaded. returns true if directive plugin already registered
 * @param Vue
 * @param name
 * @param def
 * @returns {*}
 */
export function registerDirective(Vue, name, def) {
    Vue._bootstrap_vue_directives_ = Vue._bootstrap_vue_directives_ || {};
    const loaded = Vue._bootstrap_vue_directives_[name];
    if (!loaded && def && name) {
        Vue._bootstrap_vue_directives_[name] = true;
        Vue.directive(name, def);
    }
    return loaded;
}

/**
 * Register a group of directives as being loaded.
 * @param Vue
 * @param directives
 */
export function registerDirectives(Vue, directives) {
    for (const directive in directives) {
        if (directives.hasOwnProperty(directive)) {
            registerDirective(Vue, directive, directives[directive]);
        }
    }
}

/**
 * Install plugin if window.Vue available
 * @param VuePlugin
 */
export function vueUse(VuePlugin) {
    if (typeof window !== 'undefined' && window.Vue) {
        window.Vue.use(VuePlugin);
    }
}
