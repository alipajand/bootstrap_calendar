# Persian Calendar
vue js calendar based on vue-bootstrap

## Project setup for development
```
yarn install
yarn run serve
```

### Requirements
- [Bootstrap-Vue](https://bootstrap-vue.js.org/)

### Basic configs
```
import Vue from 'vue';

import CalendarComponent from '../index';
import 'persian-calendar/src/styles/index.scss';
Vue.use(CalendarComponent);
```

### Example
```
<calendar-component v-bind:inputShowTime="false"
                    v-bind:input-show-placeholder="false"
                    v-bind:inputShowFooterButtons="false"
                    v-bind:inputPrimaryColor="'#17a2b8'"
                    v-bind:inputShowIcons="false">
</calendar-component>
```
