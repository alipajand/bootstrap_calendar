<template>
    <div class="app-calendar-row" v-if="flags.initialCalendar">
        <b-form-group
            class="input-with-icon"
            v-bind:label="placeholder"
            v-if="inputShowTitle">
            <b-input-group>
                <b-form-input type="text"
                              readonly
                              autocomplete="off"
                              v-model="calendar.text"
                              class="app-calendar-input bg-white"
                              v-bind:horizontal="inputHorizontalView"
                              v-on:click.native.prevent="toggleCalendar($event)">
                </b-form-input>
                <b-input-group-text slot="append" class="large p-3 border-0 pointer"
                                    v-on:click="removeDate()" v-if="calendar.text && inputShowIcons">
                    <i class="fa fa-times"></i>
                </b-input-group-text>
                <b-input-group-text slot="prepend" class="large p-2 border-0 pointer"
                                    v-if="calendar.text && inputAllowEmpty">
                    <i class="far fa-calendar-alt"></i>
                </b-input-group-text>
            </b-input-group>
        </b-form-group>
        <b-form-input readonly
                      type="text"
                      autocomplete="off"
                      v-model="calendar.text"
                      class="app-calendar-input bg-white"
                      v-on:click.native.prevent="toggleCalendar($event)"
                      v-else>
        </b-form-input>

        <!--calendar panel-->
        <b-card no-body class="app-calendar shadow d-none mb-5" v-bind:id="calendarSelector">
            <div v-if="flags.showDates">
                <b-row class="app-calendar-header">
                    <b-col cols="12">
                        <b-button variant="link" class="border-0 float-right btn-icon"
                                  v-bind:disabled="date <= inputMinYear"
                                  v-on:click="goToPreviousMonth()">
                            <i class="fa fa-arrow-right"></i>
                        </b-button>
                        <span class="app-calendar-header-month float-right text-center pointer bg-primary"
                              v-on:click="showMonths(monthInfo.firstDayOfMonth)">
                            {{monthInfo.title}}
                        </span>
                        <span class="app-calendar-header-month float-right text-center pointer bg-primary"
                              v-on:click="showYears()">
                            {{yearInfo}}
                        </span>
                        <b-button variant="link" class="border-0 float-left btn-icon"
                                  v-bind:disabled="date >= inputMaxYear"
                                  v-on:click="goToNextMonth()">
                            <i class="fa fa-arrow-left"></i>
                        </b-button>
                    </b-col>
                </b-row>
                <b-row class="justify-content-center app-calendar-container">
                    <b-col cols="12">
                        <ul class="list-unstyled show-weekdays float-right p-0">
                            <li v-for="(day, index) in daysInPersian" v-bind:key="index">
                                {{day.title}}
                            </li>
                        </ul>
                        <ul class="list-unstyled show-days float-right p-0">
                            <li v-for="(day, index) in dayArray"
                                v-bind:key="index"
                                v-bind:class="[
                                        day.isHoliday ? 'day-isHoliday text-danger' : '',
                                        day.isToday && inputHighlightToday ? 'day-isToday' : '',
                                        inputMinDate && day.dateFormat < inputMinDate ? 'day-deactivate' : '',
                                        inputMaxDate && day.dateFormat > inputMaxDate ? 'day-deactivate' : '',
                                        day.isGrey && !inputShowNextMonth ? 'hide-other-month' : '',
                                        day.isGrey ? 'day-isGrey' : '',
                                        day.isSelected ? 'day-isSelected' : '']"
                                v-on:click="checkSelectability(day)">
                                {{day.title}}
                            </li>
                        </ul>
                    </b-col>
                </b-row>
                <b-row class="app-calendar-time" v-if="inputShowTime">
                    <b-col cols="6">
                        <b-form-input type="text"
                                      autocomplete="off"
                                      class="text-center"
                                      placeholder="دقیقه" min="0" max="60"
                                      tabindex="2" v-model="calendar.minute" v-on:change="changeMinute()">
                        </b-form-input>
                        <span class="text-body">:</span>
                    </b-col>
                    <b-col cols="6">
                        <b-form-input type="text"
                                      autocomplete="off"
                                      class="text-center form-control"
                                      placeholder="ساعت" min="0" max="24"
                                      tabindex="1" v-model="calendar.hour" v-on:change="changeHour()">
                        </b-form-input>
                    </b-col>
                </b-row>
                <b-row class="app-calendar-footer">
                    <b-col sm="4" class="mb-1" v-if="inputShowFooterButtons">
                        <b-button variant="light" class="p-2" block v-on:click="goToToday()">
                            امروز
                        </b-button>
                    </b-col>
                    <b-col sm="4" class="mb-1" v-if="inputShowFooterButtons">
                        <b-button variant="light" class="p-2" block v-on:click="goToCurrentMonth()">
                            ماه جــاری
                        </b-button>
                    </b-col>
                    <b-col v-bind:sm="!inputShowFooterButtons ? '12' : '4'">
                        <b-button variant="light" class="p-2" block v-on:click="closeCalendar()"
                                  tabindex="3">
                            بستن
                        </b-button>
                    </b-col>
                </b-row>
            </div>
            <div v-if="flags.showMonths">
                <b-row class="app-calendar-header">
                    <b-col cols="12">
                        <div class="app-calendar-header-choose float-right text-center">
                            یک ماه را انتخاب کنید
                        </div>
                    </b-col>
                </b-row>
                <ul class="list-unstyled show-months p-0">
                    <li v-for="(month, index) in monthsInPersian"
                        v-bind:key="index"
                        v-on:click="selectMonth(month.firstDay)"
                        v-bind:class="month.isSelected ? 'month-isSelected' : ''">
                        {{month.title}}
                    </li>
                </ul>
            </div>
            <div v-if="flags.showYears">
                <b-row class="app-calendar-header">
                    <b-col cols="12">
                        <div class="app-calendar-header-choose float-right text-center">
                            یک سال را انتخاب کنید
                        </div>
                    </b-col>
                </b-row>
                <b-button variant="link" class="app-calendar-show-less text-center float-right"
                          v-on:click.prevent="showYearGoUp()">
                    <i class="fa fa-caret-up"></i>
                </b-button>
                <ul class="list-unstyled show-year p-0">
                    <li v-for="(year, index) in yearsInPersian"
                        v-bind:key="index"
                        v-if="year.title"
                        v-on:click="selectYear(year.title)"
                        v-bind:class="year.isSelected ? 'year-isSelected' : ''">
                        {{year.title}}
                    </li>
                </ul>
                <b-button variant="link" class="app-calendar-show-more text-center float-right"
                          v-on:click.prevent="showYearGoDown()">
                    <i class="fa fa-caret-down"></i>
                </b-button>
            </div>
        </b-card>
    </div>
</template>

<script type="text/javascript">
    export default {
        props: {
            inputMaxYear: {
                type: Date,
                required: false
            },
            inputMinYear: {
                type: Date,
                required: false
            },
            inputMinDate: {
                type: Date,
                required: false
            },
            inputMaxDate: {
                type: Date,
                required: false
            },
            inputShowFooterButtons: {
                type: Boolean,
                default: true,
                required: false
            },
            inputHorizontalView: {
                type: Boolean,
                default: false,
                required: false
            },
            inputHighlightToday: {
                type: Boolean,
                default: true,
                required: false
            },
            inputShowNextMonth: {
                type: Boolean,
                default: true,
                required: false
            },
            inputShowTime: {
                type: Boolean,
                default: true,
                required: false
            },
            inputShowIcons: {
                type: Boolean,
                default: true,
                required: false
            },
            inputAllowEmpty: {
                type: Boolean,
                default: true,
                required: false
            },
            inputShowTitle: {
                type: Boolean,
                default: true,
                required: false
            },
            inputPlaceholder: {
                type: String,
                required: false
            },
            inputSelectedDate: {
                type: Date,
                required: false
            },
            inputCalendarSelector: {
                type: String,
                required: false
            }
        },
        data() {
            return {
                date: new Date(),
                dayArray: [],
                yearToShow: 2,
                yearInfo: null,
                placeholder: '',
                monthInfo: null,
                yearsInPersian: null,
                calendarSelector: 'app-calendar',
                monthsInPersian: [
                    { index: 0, title: 'فروردین', days: 31, isSelected: false, firstDay: '' },
                    { index: 1, title: 'اردیبهشت', days: 31, isSelected: false, firstDay: '' },
                    { index: 2, title: 'خرداد', days: 31, isSelected: false, firstDay: '' },
                    { index: 3, title: 'تیر', days: 31, isSelected: false, firstDay: '' },
                    { index: 4, title: 'مرداد', days: 31, isSelected: false, firstDay: '' },
                    { index: 5, title: 'شهریور', days: 31, isSelected: false, firstDay: '' },
                    { index: 6, title: 'مهر', days: 30, isSelected: false, firstDay: '' },
                    { index: 7, title: 'آبان', days: 30, isSelected: false, firstDay: '' },
                    { index: 8, title: 'آذر', days: 30, isSelected: false, firstDay: '' },
                    { index: 9, title: 'دی', days: 30, isSelected: false, firstDay: '' },
                    { index: 10, title: 'بهمن', days: 30, isSelected: false, firstDay: '' },
                    { index: 11, title: 'اسفند', days: 29, isSelected: false, firstDay: '' }
                ],
                daysInPersian: [
                    { index: 0, title: 'شــنــبــــــه', searchable: 'شنبه' },
                    { index: 1, title: 'یــکشـنبــه', searchable: 'یکشنبه' },
                    { index: 2, title: 'دوشـنبــــه', searchable: 'دوشنبه' },
                    { index: 3, title: 'سه‌شنبـــه', searchable: 'سه‌شنبه' },
                    { index: 4, title: 'چهارشنبـه', searchable: 'چهارشنبه' },
                    { index: 5, title: 'پنجـشنبــه', searchable: 'پنجشنبه' },
                    { index: 6, title: 'جـمــعـــــــه', searchable: 'جمعه' }
                ],
                calendar: {
                    show: false,
                    text: '',
                    hour: 0,
                    minute: 0
                },
                flags: {
                    initialCalendar: false,
                    showDates: true,
                    showMonths: false,
                    showYears: false
                }
            };
        },
        watch: {
            'inputSelectedDate': function () {
                this.fillData();
            },
            'inputMaxYear': function () {
                this.fillData();
            },
            'inputMinYear': function () {
                this.fillData();
            },
            'inputPlaceholder': function () {
                this.placeholder = this.inputPlaceholder;
            }
        },
        mounted() {
            this.fillData();

            /**
             * to close calendar
             */
            $('body').on('click', e => {
                let container = $('.app-calendar-input, .app-calendar');
                if (!container.is(e.target) && container.has(e.target).length === 0) {
                    this.closeCalendar();
                }
            });
        },
        methods: {
            fillData() {
                this.placeholder = this.inputPlaceholder ? this.inputPlaceholder : 'تاریخ مورد نظر خود را انتخاب کنید';

                /**
                 * Define selector
                 */
                if (this.inputCalendarSelector) {
                    this.calendarSelector = this.inputCalendarSelector;
                }

                /**
                 * Calculate First Day Of Year
                 */
                if (this.inputMaxYear && !this.inputSelectedDate) {
                    const persianYear = parseInt(this._getPersianYear(new Date()));
                    const persianMaxYear = parseInt(this._getPersianYear(this.inputMaxYear));
                    const abs = persianYear - persianMaxYear;
                    const newDate = new Date();
                    newDate.setFullYear(newDate.getFullYear() - abs);

                    this.date = this._getFirstDayOfYear(newDate);
                }

                /**
                 * Decide to fill input
                 */
                if (this.inputSelectedDate) {
                    this.date = new Date(this.inputSelectedDate);
                    this.calendar.text = this._convertToPersianDate(this.date, 'combo');
                } else {
                    this.calendar.text = '';
                }

                /**
                 *
                 */
                this._createCalendar();
                this._checkLeapYear();
            },
            removeDate() {
                this.calendar.text = '';
                this.$emit('changeDate', null);
            },
            toggleCalendar() {
                const selector = '#' + this.calendarSelector;
                if ($(selector).hasClass('d-none')) {
                    this.closeCalendar();
                    $(selector).removeClass('d-none');
                    this._createCalendar();
                } else {
                    this.closeCalendar();
                }
            },
            closeCalendar() {
                $('.app-calendar').addClass('d-none');
                this.flags.showDates = true;
                this.flags.showMonths = false;
                this.flags.showYears = false;
            },
            selectDay(day) {
                for (let i = 0; i < 42; i++) {
                    this.dayArray[i].isSelected = false;
                }
                day.isSelected = true;
                this.date = new Date(day.dateFormat);
                this.$emit('changeDate', this.date);
                this._updateModel(this.date);
                this.closeCalendar();
            },
            checkSelectability(day) {
                let condition = false;
                if (!this.inputMinDate && !this.inputMaxDate) {
                    condition = true;
                } else if (!this.inputMinDate && this.inputMaxDate && day.dateFormat <= this.inputMaxDate) {
                    condition = true;
                } else if (!this.inputMaxDate && this.inputMinDate && day.dateFormat >= this.inputMinDate) {
                    condition = true;
                } else if (this.inputMinDate && this.inputMaxDate && day.dateFormat >= this.inputMinDate && day.dateFormat <= this.inputMaxDate) {
                    condition = true;
                }
                if (condition) {
                    this.selectDay(day);
                }
            },
            goToToday() {
                this.date = new Date();
                this._updateModel(this.date);
                this._checkLeapYear();
                this.closeCalendar();
            },
            goToNextMonth() {
                this._checkLeapYear();
                this.date.setDate(this.date.getDate() + parseInt(this.monthInfo.days, 0));

                this._createCalendar();
            },
            goToCurrentMonth() {
                this.date = new Date();
                this._checkLeapYear();
                this.date.setDate(this.date.getDate());

                this._createCalendar();
            },
            goToPreviousMonth() {
                this._checkLeapYear();
                this.date.setDate(this.date.getDate() - parseInt(this.monthInfo.previousMonthAmount, 0));

                this._createCalendar();
            },
            _createCalendar(date) {
                let firstDayOfMonth;
                let persianWeekday;
                let persianWeekdayIndex;
                let counter = 1;

                if (!date) {
                    if (!this.date) {
                        date = new Date();
                    } else {
                        date = this.date;
                    }
                }

                this._resetData();

                firstDayOfMonth = this._getFirstDayOfMonth(date);
                persianWeekday = this._getPersianWeekday(firstDayOfMonth);
                this.yearInfo = this._getPersianYear(firstDayOfMonth); // !! should be above of month
                this.monthInfo = this._fillMonthInfo(firstDayOfMonth);

                /**
                 * create weekday
                 */
                for (const i in this.daysInPersian) {
                    if (this.daysInPersian.hasOwnProperty(i)) {
                        if (this.daysInPersian[i].searchable === persianWeekday) {
                            persianWeekdayIndex = parseInt(i, 0) + 1;
                        }
                    }
                }

                /**
                 * create column 1 (previous month)
                 */
                for (let row = 1; row < persianWeekdayIndex; row++) {
                    const column = 1;
                    const formula = ((row - 1) * 6) + column - 1;
                    const dataArray = this.dayArray[formula];
                    const dateFormat = new Date(firstDayOfMonth);

                    if (formula > 42 || counter > this.monthInfo.previousMonthAmount) {
                        break;
                    }
                    dataArray.isGrey = true;
                    dataArray.title = this.monthInfo.previousMonthAmount - persianWeekdayIndex + row + 1;
                    dataArray.dateFormat = new Date(dateFormat.setDate(firstDayOfMonth.getDate() - persianWeekdayIndex + row));
                }

                /**
                 * create column 2 (this month)
                 */
                for (let row = persianWeekdayIndex; row <= 7; row++) {
                    const column = 1;
                    const formula = ((row - 1) * 6) + column - 1;
                    const dataArray = this.dayArray[formula];
                    const dateFormat = new Date(firstDayOfMonth);

                    if (formula > 42 || counter > this.monthInfo.days) {
                        break;
                    }

                    dataArray.title = counter;
                    dataArray.dateFormat = new Date(dateFormat.setDate(firstDayOfMonth.getDate() + counter - 1));

                    if (row === 7) {
                        dataArray.isHoliday = true;
                    }
                    if (this._isCounterTodayDate(counter)) {
                        dataArray.isToday = true;
                    }
                    if (this._isCounterSelected(counter)) {
                        dataArray.isSelected = true;
                    }
                    counter++;
                }

                /**
                 * create column 2 to 7 (this month and next month)
                 */
                for (let column = 2, nextMonthCounter = 1; column <= 6; column++) {
                    for (let row = 1; row <= 7; row++) {
                        const formula = ((row - 1) * 6) + column - 1;
                        const dataArray = this.dayArray[formula];
                        const dateFormat = new Date(firstDayOfMonth);

                        if (formula > 42) {
                            break;
                        }
                        if (counter > this.monthInfo.days) {
                            const nexMonthDateFormat = new Date(firstDayOfMonth);
                            if (row === 7) {
                                dataArray.isHoliday = true;
                            }
                            dataArray.title = nextMonthCounter;
                            dataArray.isGrey = true;
                            dataArray.dateFormat = new Date(nexMonthDateFormat.setDate(firstDayOfMonth.getDate() + nextMonthCounter + this.monthInfo.days - 1));

                            nextMonthCounter++;
                            continue;
                        }

                        dataArray.title = counter;
                        dataArray.dateFormat = new Date(dateFormat.setDate(firstDayOfMonth.getDate() + counter - 1));

                        if (row === 7) {
                            dataArray.isHoliday = true;
                        }
                        if (this._isCounterTodayDate(counter)) {
                            dataArray.isToday = true;
                        }
                        if (this._isCounterSelected(counter)) {
                            dataArray.isSelected = true;
                        }
                        counter++;
                    }
                }

                this.flags.initialCalendar = true;
            },
            _updateModel(date) {
                this.calendar.text = this._convertToPersianDate(date, 'combo');
                this.calendar.hour = this._getHour(date);
                this.calendar.minute = this._getMinute(date);
            },
            _checkLeapYear() {
                const date = this.date;
                if (this._isLeapYear(this._getPersianYear(date))) {
                    this.monthsInPersian[11].days = 30;
                } else {
                    this.monthsInPersian[11].days = 29;
                }
            },
            _isCounterSelected(counter) {
                if (!this.inputSelectedDate) {
                    return false;
                }

                const dateDay = this._getPersianDay(this.inputSelectedDate);
                const dateMonth = this._getPersianMonth(this.inputSelectedDate);
                const dateYear = this._getPersianYear(this.inputSelectedDate);
                counter = counter.toString();

                return (counter === dateDay && this.monthInfo.title === dateMonth && this.yearInfo === dateYear);
            },
            _isCounterTodayDate(counter) {
                const dateDay = this._getPersianDay(new Date());
                const dateMonth = this._getPersianMonth(new Date());
                const dateYear = this._getPersianYear(new Date());
                counter = counter.toString();

                return (counter === dateDay && this.monthInfo.title === dateMonth && this.yearInfo === dateYear);
            },
            _resetData() {
                this.dayArray = [];
                for (let i = 0; i < 42; i++) {
                    this.dayArray.push({
                        title: null,
                        isHoliday: false,
                        isGrey: false,
                        isToday: false,
                        isSelected: false,
                        dateFormat: null
                    });
                }
            },
            _getFirstDayOfMonth(date) {
                const firstDay = new Date(date);
                const pastDays = parseInt(this._getPersianDay(date));
                firstDay.setDate(firstDay.getDate() - pastDays + 1);
                return firstDay;
            },
            _getFirstDayOfYear(date) {
                date = this._getFirstDayOfMonth(date);
                const getMonth = this._getPersianMonth(new Date(date), '2-digit');
                const getMonthIndex = parseInt(this._convertToEnglishDigit(getMonth)) - 1;
                let pastDays = 0;

                for (let index = 0; index < getMonthIndex; index++) {
                    pastDays += parseInt(this.monthsInPersian[index].days);
                }
                return new Date(date.setDate(date.getDate() - pastDays));
            },
            _fillMonthInfo(date) {
                let persianDate,
                    monthIndex,
                    daysAmount,
                    monthName,
                    nexMonthAmount,
                    previousMonthAmount;

                persianDate = this._getPersianMonth(date);

                for (const index in this.monthsInPersian) {
                    if (this.monthsInPersian.hasOwnProperty(index)) {
                        if (this.monthsInPersian[index].title === persianDate) {
                            monthIndex = index;
                            daysAmount = this.monthsInPersian[index].days;
                            monthName = this.monthsInPersian[index].title;
                            nexMonthAmount = this.monthsInPersian[parseInt(index, 0) + 1 > 11 ? 0 : parseInt(index, 0) + 1].days;
                            previousMonthAmount = this.monthsInPersian[parseInt(index, 0) - 1 < 0 ? 11 : parseInt(index, 0) - 1].days;
                        }
                    }
                }
                if (this._isLeapYear(parseInt(this.yearInfo) - 1) && parseInt(monthIndex) === 0) {
                    previousMonthAmount = 30;
                }

                if (this._isLeapYear(this.yearInfo) && parseInt(monthIndex) === 11) {
                    daysAmount = 30;
                }

                if (this._isLeapYear(this.yearInfo) && parseInt(monthIndex) === 10) {
                    nexMonthAmount = 30;
                }

                return {
                    index: monthIndex,
                    number: parseInt(monthIndex) + 1,
                    title: monthName,
                    days: daysAmount,
                    nexMonthAmount: nexMonthAmount,
                    previousMonthAmount: previousMonthAmount,
                    firstDayOfMonth: date
                };
            },
            _isLeapYear(year) {
                return ((((((year - ((year > 0) ? 474 : 473)) % 2820) + 474) + 38) * 682) % 2816) < 682;
            },
            _getPersianDay(date, opt) {
                const options = { day: opt || 'numeric' };
                return this._convertToEnglishDigit(date.toLocaleDateString('fa-persian', options));
            },
            _getPersianWeekday(date, opt) {
                const options = { weekday: opt || 'long' };
                return date.toLocaleDateString('fa-persian', options);
            },
            _getPersianMonth(date, opt) {
                const options = { month: opt || 'long' };
                return date.toLocaleDateString('fa-persian', options);
            },
            _getPersianYear(date, opt) {
                const options = { year: opt || 'numeric' };
                return this._convertToEnglishDigit(date.toLocaleDateString('fa-persian', options));
            },
            _getHour(date) {
                const options = { hour: '2-digit' };
                const output = date.toLocaleString('fa-persian', options);
                if (output.length <= 1) {
                    return '0' + output;
                }
                return output;
            },
            _getMinute(date) {
                const options = { minute: '2-digit' };
                const output = date.toLocaleString('fa-persian', options);
                if (output.length <= 1) {
                    return '0' + output;
                }
                return output;
            },
            _convertToPersianDate(date, type) {
                if (!date) {
                    return;
                }
                if (!type) {
                    type = 'combo';
                }
                const year = this._convertToEnglishDigit(this._getPersianYear(date, 'numeric'));
                const weekday = this._getPersianWeekday(date, 'long');
                const hour = this._getHour(date);
                const minute = this._getMinute(date);

                let month = this._convertToEnglishDigit(this._getPersianMonth(date, '2-digit'));
                let day = this._getPersianDay(date, '2-digit');

                if (day.length <= 1) {
                    day = '0' + day;
                }
                if (month.length <= 1) {
                    month = '0' + month;
                }
                if (type === 'combo') {
                    let output;
                    month = this._getPersianMonth(date, 'long');
                    output = `${weekday} ${day} ${month} ${year}`;
                    if (this.inputShowTime) {
                        output += ` - ${hour}:${minute}`;
                    }
                    return output;
                }
                return `${year}/${month}/${day}`;
            },
            _convertToEnglishDigit(string) {
                return string.replace(/[\u0660-\u0669]/g, (c) => {
                    return c.charCodeAt(0) - 0x0660;
                }).replace(/[\u06f0-\u06f9]/g, (c) => {
                    return c.charCodeAt(0) - 0x06f0;
                });
            },

            /**
             * Selecting a month and a year together
             */
            showMonths(firstDayOfMonth) {
                /**
                 * Month Index Selected
                 */
                let differenceYear;
                let increasingDay = 0;
                let firstDayOfYear;

                if (!firstDayOfMonth) {
                    firstDayOfMonth = this.monthInfo.firstDayOfMonth;
                }

                /**
                 * Reset is selected
                 */
                for (const i in this.monthsInPersian) {
                    if (this.monthsInPersian.hasOwnProperty(i)) {
                        this.monthsInPersian[i].isSelected = false;
                    }
                }

                /**
                 * Find and select month
                 */
                for (const i in this.monthsInPersian) {
                    if (this.monthsInPersian.hasOwnProperty(i)) {
                        if (this.monthsInPersian[i].title === this._getPersianMonth(firstDayOfMonth)) {
                            this.monthsInPersian[i].isSelected = true;
                            break;
                        }
                    }
                }

                /**
                 * Calculate days after changing year
                 */
                firstDayOfMonth = this.monthInfo.firstDayOfMonth;
                firstDayOfYear = new Date(this._getFirstDayOfYear(firstDayOfMonth));
                if (this.yearInfo !== parseInt(this._getPersianYear(firstDayOfYear))) {
                    differenceYear = this.yearInfo - parseInt(this._getPersianYear(firstDayOfYear));
                    this.date = new Date(firstDayOfYear.setFullYear(firstDayOfYear.getFullYear() + differenceYear));
                    this.yearInfo = parseInt(this._getPersianYear(this.date));
                }

                /**
                 * Find and select month
                 */
                for (const i in this.monthsInPersian) {
                    if (this.monthsInPersian.hasOwnProperty(i)) {
                        this.monthsInPersian[i].firstDay =
                            new Date(firstDayOfYear.setDate(firstDayOfYear.getDate() + increasingDay));
                        increasingDay = this.monthsInPersian[i].days;
                    }
                }

                /**
                 * show other panel
                 */
                this.flags.showDates = false;
                this.flags.showYears = false;
                this.flags.showMonths = true;
            },
            selectMonth(firstDayOfMonth) {
                /**
                 * Update date and month
                 */
                this.date = new Date(firstDayOfMonth);
                this.monthInfo = this._fillMonthInfo(this.date);

                /**
                 * Show other panel
                 */
                this.flags.showMonths = false;
                this.flags.showYears = false;
                this.flags.showDates = true;

                /**
                 * Create calendar
                 */
                this._createCalendar();
            },
            showYears(yearToShow) {
                if (!yearToShow) {
                    yearToShow = 0;
                }

                /**
                 * Create year array
                 */
                this.yearsInPersian = [];
                for (let i = yearToShow - 4; i <= yearToShow + 4; i++) {
                    if (parseInt(this.yearInfo) + i > this._getPersianYear(this.inputMaxYear) || parseInt(this.yearInfo) + i < this._getPersianYear(this.inputMinYear)) {
                        continue;
                    }
                    const generatedYear = parseInt(this.yearInfo) + i;
                    this.yearsInPersian.push({
                        title: generatedYear,
                        isSelected: false
                    });
                }

                if (this.yearsInPersian.length === 0) {
                    for (let i = 0; i < 9; i++) {
                        const generatedYear = parseInt(this._getPersianYear(this.inputMaxYear)) - i;
                        this.yearsInPersian.push({
                            title: generatedYear,
                            isSelected: false
                        });
                    }
                }

                /**
                 * Find and select year
                 */
                for (const i in this.yearsInPersian) {
                    if (this.yearsInPersian.hasOwnProperty(i)) {
                        if (this.yearsInPersian[i].title.toString() === this.yearInfo) {
                            this.yearsInPersian[i].isSelected = true;
                            break;
                        }
                    }
                }

                /**
                 * Show other panel
                 */
                this.flags.showDates = false;
                this.flags.showMonths = false;
                this.flags.showYears = true;
            },
            selectYear(year) {
                /**
                 * show other panel
                 */
                this.flags.showDates = false;
                this.flags.showYears = false;
                this.flags.showMonths = true;

                /**
                 * update year info
                 */
                this.yearInfo = year;

                /**
                 * create month panel
                 */
                this.showMonths();
            },
            showYearGoUp() {
                if (this.yearsInPersian[0].title <= this._getPersianYear(this.inputMinYear)) {
                    return;
                }

                this.yearToShow -= 3;
                this.showYears(this.yearToShow);
            },
            showYearGoDown() {
                const index = this.yearsInPersian.length - 1;
                if (this.yearsInPersian[index].title >= this._getPersianYear(this.inputMaxYear)) {
                    return;
                }
                this.yearToShow += 3;
                this.showYears(this.yearToShow);
            },

            /**
             * selecting an hour and minute
             */
            changeHour() {
                if (!this.calendar.hour) {
                    this.calendar.hour = 0;
                }
                const selectedDate = this.inputSelectedDate;
                const newHour = this._convertToEnglishDigit(this.calendar.hour);
                const date = new Date(selectedDate.setHours(newHour));
                this.monthInfo = this._fillMonthInfo(date);
                this.$emit('changeDate', date);
                this._updateModel(date);
                this._createCalendar(date);
                this.date = date;
            },
            changeMinute() {
                if (!this.calendar.minute) {
                    this.calendar.minute = 0;
                }
                const selectedDate = this.inputSelectedDate;
                const newMinute = this._convertToEnglishDigit(this.calendar.minute);
                const date = new Date(selectedDate.setMinutes(newMinute));
                this.monthInfo = this._fillMonthInfo(date);
                this.$emit('changeDate', date);
                this._updateModel(date);
                this._createCalendar(date);
                this.date = date;
            }
        }
    };
</script>
