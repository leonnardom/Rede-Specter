const DBWrapper = require('../DBWrapper.js');
const { GuildRepository, UserRepository, ComandoRepository, ClientRepository } = require('./repositories');

const mongoose = require('mongoose');

module.exports = class MongoDB extends DBWrapper {
    constructor(options = {}) {
        super(options)
        this.mongoose = mongoose
    }

    async connect() {
        return mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true }).then((m) => {
            this.guilds = new GuildRepository(m);
            this.users = new UserRepository(m);
            this.comandos = new ComandoRepository(m);
            this.clientUtils = new ClientRepository(m);
        })
    }
}