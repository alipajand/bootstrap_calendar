import {Component, EventEmitter, Input, OnChanges, OnInit, Output} from '@angular/core';
import * as $ from 'jquery';

@Component({
    selector: 'app-calendar',
    templateUrl: './calendar.component.html'
})

export class CalendarComponent implements OnInit, OnChanges {
    @Input() inputShowTime ? = false;
    @Input() inputShowTitle ? = true;
    @Input() inputMinYear: any = null;
    @Input() inputMaxYear: any = null;
    @Input() inputSelectedDate: any = '';

    @Input() inputCalendarSelector ? = 'app-calendar';
    @Input() inputPlaceholder ? = 'تاریخ مورد نظر خود را انتخاب کنید';

    @Output() changeDate: EventEmitter<any> = new EventEmitter();

    date = new Date();
    dayArray: any = [];
    yearToShow = 2;
    monthInfo: any;
    yearInfo: any;
    yearsInPersian: any;
    monthsInPersian: any = [
        {index: 0, title: 'فروردین', days: 31, isSelected: false, firstDay: ''},
        {index: 1, title: 'اردیبهشت', days: 31, isSelected: false, firstDay: ''},
        {index: 2, title: 'خرداد', days: 31, isSelected: false, firstDay: ''},
        {index: 3, title: 'تیر', days: 31, isSelected: false, firstDay: ''},
        {index: 4, title: 'مرداد', days: 31, isSelected: false, firstDay: ''},
        {index: 5, title: 'شهریور', days: 31, isSelected: false, firstDay: ''},
        {index: 6, title: 'مهر', days: 30, isSelected: false, firstDay: ''},
        {index: 7, title: 'آبان', days: 30, isSelected: false, firstDay: ''},
        {index: 8, title: 'آذر', days: 30, isSelected: false, firstDay: ''},
        {index: 9, title: 'دی', days: 30, isSelected: false, firstDay: ''},
        {index: 10, title: 'بهمن', days: 30, isSelected: false, firstDay: ''},
        {index: 11, title: 'اسفند', days: 29, isSelected: false, firstDay: ''},
    ];
    daysInPersian = [
        {index: 0, title: 'شــنــبــــــه', searchable: 'شنبه'},
        {index: 1, title: 'یــکشـنبــه', searchable: 'یکشنبه'},
        {index: 2, title: 'دوشـنبــــه', searchable: 'دوشنبه'},
        {index: 3, title: 'سه‌شنبـــه', searchable: 'سه‌شنبه'},
        {index: 4, title: 'چهارشنبـه', searchable: 'چهارشنبه'},
        {index: 5, title: 'پنجـشنبــه', searchable: 'پنجشنبه'},
        {index: 6, title: 'جـمــعـــــــه', searchable: 'جمعه'}
    ];
    calendar = {
        hour: 0,
        text: '',
        minute: 0,
        show: false
    };
    flags = {
        showDates: true,
        showYears: false,
        showMonths: false,
        initialCalendar: false
    };

    ngOnInit() {
        this.fillData();

        /**
         * to close calendar
         */
        $('body').on('click', (e) => {
            const container = $('.app-calendar-input, .app-calendar');
            if (!container.is(e.target) && container.has(e.target).length === 0) {
                this.closeCalendar();
            }
        });
    }

    ngOnChanges() {
        this.fillData();
    }

    fillData() {
        if (this.inputMaxYear && (!this.inputSelectedDate || this.inputSelectedDate === '')) {
            const persianYear = parseInt(this._getPersianYear(new Date()), 10);
            const persianMaxYear = parseInt(this.inputMaxYear, 10);
            const abs = persianYear - persianMaxYear;
            const newDate = new Date();
            newDate.setFullYear(newDate.getFullYear() - abs);

            this.date = this._getFirstDayOfYear(newDate);
        }

        /**
         * Decide to fill input
         */
        if (this.inputSelectedDate && this.inputSelectedDate !== '') {
            this.date = new Date(this.inputSelectedDate);
            this.calendar.text = this._convertToPersianDate(this.date, 'combo');
        } else {
            this.calendar.text = '';
        }

        this._createCalendar();
        this._checkLeapYear();
    }

    removeDate() {
        this.calendar.text = '';
        this.changeDate.emit(null);
    }

    toggleCalendar() {
        const selector = '#' + this.inputCalendarSelector;
        if ($(selector).hasClass('d-none')) {
            this.closeCalendar();
            $(selector).removeClass('d-none');
            this._createCalendar();
            return;
        }
        this.closeCalendar();
    }

    closeCalendar() {
        $('.app-calendar').addClass('d-none');
        this.flags.showDates = true;
        this.flags.showMonths = false;
        this.flags.showYears = false;
    }

    selectDay(day: any) {
        for (let i = 0; i < 42; i++) {
            this.dayArray[i].isSelected = false;
        }
        day.isSelected = true;
        this.date = new Date(day.dateFormat);
        this.changeDate.emit(this.date);
        this._updateModel(this.date);
        this.closeCalendar();
    }

    goToToday() {
        this.date = new Date();
        this._updateModel(this.date);
        this._checkLeapYear();
        this.closeCalendar();
    }

    goToNextMonth() {
        this._checkLeapYear();
        this.date.setDate(this.date.getDate() + parseInt(this.monthInfo.days, 0));

        this._createCalendar();
    }

    goToCurrentMonth() {
        this.date = new Date();
        this._checkLeapYear();
        this.date.setDate(this.date.getDate());

        this._createCalendar();
    }

    goToPreviousMonth() {
        this._checkLeapYear();
        this.date.setDate(this.date.getDate() - parseInt(this.monthInfo.previousMonthAmount, 0));

        this._createCalendar();
    }

    private _createCalendar(date?: any) {
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
        for (let row: any = 1; row < persianWeekdayIndex; row++) {
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
         * create column 1 (this month)
         */
        for (let row = persianWeekdayIndex; row <= 7; row++) {
            const column = 1;
            const formula = ((row - 1) * 6) + column - 1;
            const dataArray = this.dayArray[formula];
            const dateFormat = new Date(firstDayOfMonth);

            if (formula > 42 || counter > this.monthInfo.days) {
                break;
            }
            if (row === 7) {
                dataArray.isHoliday = true;
            }
            if (this._isCounterTodayDate(counter)) {
                dataArray.isToday = true;
            }
            if (this._isCounterSelected(counter)) {
                dataArray.isSelected = true;
            }
            dataArray.title = counter;
            dataArray.dateFormat = new Date(dateFormat.setDate(firstDayOfMonth.getDate() + counter - 1));
            counter++;
        }

        /**
         * create column 1 to 6 (this month and next month)
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
                    dataArray.dateFormat =
                        new Date(nexMonthDateFormat.setDate(firstDayOfMonth.getDate() + nextMonthCounter + this.monthInfo.days - 1));

                    nextMonthCounter++;
                    continue;
                }
                if (row === 7) {
                    dataArray.isHoliday = true;
                }
                if (this._isCounterTodayDate(counter)) {
                    dataArray.isToday = true;
                }
                if (this._isCounterSelected(counter)) {
                    dataArray.isSelected = true;
                }
                dataArray.title = counter;
                dataArray.dateFormat = new Date(dateFormat.setDate(firstDayOfMonth.getDate() + counter - 1));
                counter++;
            }
        }

        this.flags.initialCalendar = true;
    }

    private _updateModel(date: any) {
        this.calendar.text = this._convertToPersianDate(date, 'combo');
        this.calendar.hour = this._getHour(date);
        this.calendar.minute = this._getMinute(date);
    }

    private _checkLeapYear() {
        const date = this.date;
        if (this._isLeapYear(this._getPersianYear(date))) {
            this.monthsInPersian[11].days = 30;
        } else {
            this.monthsInPersian[11].days = 29;
        }
    }

    private _isCounterSelected(counter: any) {
        let date = new Date();
        if (this.inputSelectedDate) {
            date = this.inputSelectedDate;
        }
        counter = counter.toString();
        const dateDay = this._getPersianDay(date);
        const dateMonth = this._getPersianMonth(date);
        const dateYear = this._getPersianYear(date);

        return (counter === dateDay && this.monthInfo.title === dateMonth && this.yearInfo === dateYear);
    }

    private _isCounterTodayDate(counter: any) {
        const dateDay = this._getPersianDay(new Date());
        const dateMonth = this._getPersianMonth(new Date());
        const dateYear = this._getPersianYear(new Date());
        counter = counter.toString();

        return (counter === dateDay && this.monthInfo.title === dateMonth && this.yearInfo === dateYear);
    }

    private _resetData() {
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
    }

    private _getFirstDayOfMonth(date: any) {
        const firstDay = new Date(date);
        const pastDays = parseInt(this._getPersianDay(date), 10);
        firstDay.setDate(firstDay.getDate() - pastDays + 1);
        return firstDay;
    }

    private _getFirstDayOfYear(date: any) {
        date = this._getFirstDayOfMonth(date);
        const getMonth = this._getPersianMonth(new Date(date), '2-digit');
        const getMonthIndex = parseInt(this._convertToEnglishDigit(getMonth), 10) - 1;
        let pastDays = 0;

        for (let index = 0; index < getMonthIndex; index++) {
            pastDays += parseInt(this.monthsInPersian[index].days, 10);
        }
        return new Date(date.setDate(date.getDate() - pastDays));
    }

    private _fillMonthInfo(date: any) {
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
        if (this._isLeapYear(parseInt(this.yearInfo, 10) - 1) && parseInt(monthIndex, 10) === 0) {
            previousMonthAmount = 30;
        }

        if (this._isLeapYear(this.yearInfo) && parseInt(monthIndex, 10) === 11) {
            daysAmount = 30;
        }

        if (this._isLeapYear(this.yearInfo) && parseInt(monthIndex, 10) === 10) {
            nexMonthAmount = 30;
        }

        return {
            index: monthIndex,
            number: parseInt(monthIndex, 10) + 1,
            title: monthName,
            days: daysAmount,
            nexMonthAmount: nexMonthAmount,
            previousMonthAmount: previousMonthAmount,
            firstDayOfMonth: date
        };
    }

    private _isLeapYear(year: any) {
        return ((((((year - ((year > 0) ? 474 : 473)) % 2820) + 474) + 38) * 682) % 2816) < 682;
    }

    private _getPersianDay(date: any, opt?: any) {
        const options = {day: opt || 'numeric'};
        return this._convertToEnglishDigit(date.toLocaleDateString('fa-persian', options));
    }

    private _getPersianWeekday(date: any, opt?: any) {
        const options = {weekday: opt || 'long'};
        return date.toLocaleDateString('fa-persian', options);
    }

    private _getPersianMonth(date: any, opt?: any) {
        const options = {month: opt || 'long'};
        return date.toLocaleDateString('fa-persian', options);
    }

    private _getPersianYear(date: any, opt?: any) {
        const options = {year: opt || 'numeric'};
        return this._convertToEnglishDigit(date.toLocaleDateString('fa-persian', options));
    }

    private _getHour(date: any) {
        const options = {hour: '2-digit'};
        const output = date.toLocaleString('fa-persian', options);
        if (output.length <= 1) {
            return '0' + output;
        }
        return output;
    }

    private _getMinute(date: any) {
        const options = {minute: '2-digit'};
        const output = date.toLocaleString('fa-persian', options);
        if (output.length <= 1) {
            return '0' + output;
        }
        return output;
    }

    private _convertToPersianDate(date: any, type: any) {
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
    }

    private _convertToEnglishDigit(string: any) {
        return string.replace(/[\u0660-\u0669]/g, (c: any) => {
            return c.charCodeAt(0) - 0x0660;
        }).replace(/[\u06f0-\u06f9]/g, (c: any) => {
            return c.charCodeAt(0) - 0x06f0;
        });
    }

    /**
     * Selecting a month and a year together
     */
    showMonths(firstDayOfMonth?: any) {
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
        if (this.yearInfo !== parseInt(this._getPersianYear(firstDayOfYear), 10)) {
            differenceYear = this.yearInfo - parseInt(this._getPersianYear(firstDayOfYear), 10);
            this.date = new Date(firstDayOfYear.setFullYear(firstDayOfYear.getFullYear() + differenceYear));
            this.yearInfo = parseInt(this._getPersianYear(this.date), 10);
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
        this.flags.showMonths = true;
        this.flags.showDates = false;
        this.flags.showYears = false;
    }

    selectMonth(firstDayOfMonth: any) {
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
    }

    showYears(yearToShow ?: any) {
        if (!yearToShow) {
            yearToShow = 0;
        }

        /**
         * Create year array
         */
        this.yearsInPersian = [];
        for (let i = yearToShow - 4; i <= yearToShow + 4; i++) {
            if (parseInt(this.yearInfo, 10) + i > this.inputMaxYear || parseInt(this.yearInfo, 10) + i < this.inputMinYear) {
                continue;
            }
            const generatedYear = parseInt(this.yearInfo, 10) + i;
            this.yearsInPersian.push({
                title: generatedYear,
                isSelected: false
            });
        }

        if (this.yearsInPersian.length === 0) {
            for (let i = 0; i < 9; i++) {
                const generatedYear = parseInt(this.inputMaxYear, 10) - i;
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
        this.flags.showYears = true;
        this.flags.showDates = false;
        this.flags.showMonths = false;
    }

    selectYear(year: any) {
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
    }

    showYearGoUp() {
        if (this.yearsInPersian[0].title <= this.inputMinYear) {
            return;
        }

        this.yearToShow -= 3;
        this.showYears(this.yearToShow);
    }

    showYearGoDown() {
        const index = this.yearsInPersian.length - 1;
        if (this.yearsInPersian[index].title >= this.inputMaxYear) {
            return;
        }
        this.yearToShow += 3;
        this.showYears(this.yearToShow);
    }

    /**
     * selecting an hour and minute
     */
    changeHour() {
        if (!this.calendar.hour) {
            this.calendar.hour = 0;
        }
        const inputDate = this.inputSelectedDate;
        const newHour = this._convertToEnglishDigit(this.calendar.hour);
        const date = new Date(inputDate.setHours(newHour));

        this.monthInfo = this._fillMonthInfo(date);
        this.changeDate.emit(date);
        this._updateModel(date);
        this._createCalendar(date);
        this.date = date;
    }

    changeMinute() {
        if (!this.calendar.minute) {
            this.calendar.minute = 0;
        }
        const inputDate = this.inputSelectedDate;
        const newMinute = this._convertToEnglishDigit(this.calendar.minute);
        const date = new Date(inputDate.setMinutes(newMinute));

        this.monthInfo = this._fillMonthInfo(date);
        this.changeDate.emit(date);
        this._updateModel(date);
        this._createCalendar(date);
        this.date = date;
    }
}
