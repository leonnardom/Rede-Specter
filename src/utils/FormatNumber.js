const Intl = require('intl');
Intl.__disableRegExpRestore();

module.exports = class FormatNumber {
    static localeNumber(number, lang) {
        const newNumber = new Intl.NumberFormat(lang);
        return newNumber.format(number);
    }
}