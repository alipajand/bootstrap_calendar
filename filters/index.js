import Vue from 'vue';

/**
 * Covert date to persian date
 */
Vue.filter('persianDate', (value, type) => {
    if (!value) {
        return value;
    }
    const date = new Date(value);
    const calendarType = 'fa-persian';
    let exportDate = '';

    const weekday = (opt) => {
        const options = { weekday: opt };
        return date.toLocaleDateString(calendarType, options);
    };
    const month = (opt) => {
        const options = { month: opt };
        return date.toLocaleDateString(calendarType, options);
    };
    const year = (opt) => {
        const options = { year: opt };
        return date.toLocaleDateString(calendarType, options);
    };
    const day = (opt) => {
        const options = { day: opt };
        return date.toLocaleDateString(calendarType, options);
    };
    const hour = () => {
        const options = { hour: '2-digit' };
        const output = date.toLocaleString(calendarType, options);
        if (output.length <= 1) {
            return '۰' + output;
        }
        return output;
    };
    const minute = () => {
        const options = { minute: '2-digit' };
        const output = date.toLocaleString(calendarType, options);
        if (output.length <= 1) {
            return '۰' + output;
        }
        return output;
    };

    if (type === 'time') {
        exportDate = `${hour()}:${minute()}`;
    } else if (type === 'date') {
        exportDate = `${weekday('long')} ${day('2-digit')} ${month('long')}`;
    } else if (type === 'date-with-year') {
        exportDate = `${weekday('long')} ${day('2-digit')} ${month('long')}‌ ${year('numeric')}`;
    } else if (type === 'combo') {
        exportDate = `${weekday('long')} ${day('2-digit')} ${month('long')} ${hour()}:${minute()}`;
    } else if (type === 'combo-with-year') {
        exportDate = `${weekday('long')} ${day('2-digit')} ${month('long')}‌ ${year('numeric')} ${hour()}:${minute()}`;
    } else if (type === 'slash-combo') {
        exportDate = `${year('2-digit')}/${month('2-digit')}/${day('2-digit')} ${hour()}:${minute()}`;
    } else if (type === 'slash') {
        exportDate = `${year('2-digit')}/${month('2-digit')}/${day('2-digit')}`;
    } else {
        exportDate = `${weekday('long')}، ${day('2-digit')} ${month('long')}‌ ${year('numeric')}`;
    }

    const regDate = new RegExp('\w*(ه‍.ش)');
    if (regDate.exec(exportDate)) {
        exportDate.replace('ه‍.ش.', '');
    }
    return exportDate;
});
