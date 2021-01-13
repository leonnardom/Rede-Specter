const FormatNumber = require("./FormatNumber.js");

module.exports = class LoaderPrototypes {
    static loader() {
        Number.prototype.localeNumber = function (lang) {
            return FormatNumber.localeNumber(this, lang);
        }
    }
}