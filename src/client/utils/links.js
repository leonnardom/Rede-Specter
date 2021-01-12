module.exports = class LinksUtils {
    constructor(util) {
        this.name = "links"
        this.utils = util;
    }

    load() {
        const links = require("../../utils/JSON").Utils[this.name];
        return this.utils.all.set(this.name, links);;
    }
}