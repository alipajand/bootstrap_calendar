import { version } from './package.json';
import CalendarComponent from './src/components/calendar';

export default {
  install(Vue) {
    Vue.component(CalendarComponent.name, CalendarComponent);
  },
  version
};

export {
  CalendarComponent
};
