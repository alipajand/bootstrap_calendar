<template>
    <b-container>
        <b-row class="justify-content-center m-5">
            <b-col lg="6" md="8" sm="10" cols="12">
                <h1>
                    تقویم شمسی
                </h1>
                <hr>
                <calendar-component class="mt-5"
                                    v-bind:input-show-time="false"
                                    v-bind:input-title="'انتخاب تاریخ'"
                                    v-bind:input-primary-color="'#529b78'"
                                    v-bind:input-selected-date="calendar.selected"
                                    v-on:changeDate="calendar.selected = $event">
                </calendar-component>
                <calendar-component class="mt-5"
                                    v-bind:input-title="'انتخاب تاریخ'"
                                    v-bind:input-show-title="false"
                                    v-bind:input-selected-date="calendar.selected"
                                    v-on:changeDate="calendar.selected = $event">
                </calendar-component>
            </b-col>
        </b-row>
    </b-container>
</template>

<script>
    import CalendarComponent from '../components/calendar';

    export default {
        data() {
            return {
                calendar: {
                    selected: null
                }
            };
        },
        components: {
            CalendarComponent
        }
    };
</script>
