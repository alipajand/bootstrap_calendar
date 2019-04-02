<template>
    <b-container>
        <b-row class="justify-content-center my-5">
            <b-col lg="6" md="8" sm="10" cols="12">
                <h1>
                    تقویم شمسی
                </h1>
                <hr>
                <calendar-component class="mt-5"
                                    v-bind:input-title="'انتخاب تاریخ'"
                                    v-bind:time-zone="'Asia/Tehran'"
                                    v-bind:input-selected-date="calendar.selected"
                                    v-on:changeDate="calendar.selected = $event">
                </calendar-component>
                <hr class="my-5">
                <calendar-component v-bind:input-show-time="false"
                                    v-bind:input-title="'انتخاب تاریخ'"
                                    v-bind:input-max-year="maxYear"
                                    v-bind:input-min-year="minYear"
                                    v-bind:input-selected-date="calendar.selected"
                                    v-on:changeDate="calendar.selected = $event">
                </calendar-component>
                <div class="text-black-50">
                    تاریخ ماکزیمم سال: {{maxYear | persianDate}}
                    <br>
                    تاریخ مینیمم سال: {{minYear | persianDate}}
                </div>
            </b-col>
        </b-row>
    </b-container>
</template>

<script>
    export default {
        data () {
            return {
                calendar: {
                    selected: null
                }
            };
        },
        computed: {
            maxYear: function() {
                const maxYearDate = new Date();
                return new Date(maxYearDate.setFullYear(maxYearDate.getFullYear() - 15));
            },
            minYear: function() {
                const minYearDate = new Date();
                return new Date(minYearDate.setFullYear(minYearDate.getFullYear() - 80));
            }
        }
    };
</script>
