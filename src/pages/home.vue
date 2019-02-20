<template>
    <b-container>
        <b-row class="justify-content-center">
            <b-col lg="6" md="8" sm="10" cols="12">
                <calendar-component class="m-5"
                                    v-bind:inputSelectedDate="data.calendar.selected"
                                    v-on:changeDate="data.calendar.selected = $event">
                </calendar-component>
            </b-col>
        </b-row>
    </b-container>
</template>

<script>
    import calendarComponent from '../components/calendar/calendar';

    export default {
        name: 'home',
        data () {
            return {
                data: {
                    calendar: {
                        selected: null
                    }
                }
            };
        },
        components: {
            calendarComponent
        }
    };
</script>
