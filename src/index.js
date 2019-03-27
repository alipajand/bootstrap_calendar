import CalendarComponent from './components/calendar';

// This exports the plugin object.
export default {
    // The install method will be called with the Vue constructor as
    // the first argument, along with possible options
    install (Vue, options) {
        Vue.component('CalendarComponent', CalendarComponent);
    }
};
