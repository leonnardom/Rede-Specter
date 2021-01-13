const { Schema } = require('mongoose');

const CommandUtils = {
    ownerPermission: false,
    gerentePermission: false,
    coordenadorPermission: false,
    devPermission: false,
    vipUser: false
}

module.exports = new Schema({
    _id: {
        type: String
    },
    utils: {
        type: Object,
        default: CommandUtils
    },
    maintence: {
        type: Boolean,
        default: false
    },
    usages: {
        type: Number,
        default: 0
    }
})