import CalendarComponent from './TheCalendar';
import { registerComponents } from '../../utils/plugins';

const components = {
    CalendarComponent
};

export default {
    install (Vue) {
        registerComponents(Vue, components);
    }
};
