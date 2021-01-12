const { promisify } = require('util');
const fs = require("fs");

module.exports = class EventsLoader {
    constructor(client) {
        this.name = 'EventsLoader'
        this.client = client
        this.events = new client.collection
    }

    async call() {
        this.client.events = this.events;
        return this.LoaderEvents()
            .then(() => {
                this.client.LOG('Module loaded successfully without any errors', 'EVENTS');
            })
    }

    async LoaderEvents(evtPath = "src/client/listeningIn") {
        const files = await EventsLoader.readdir(evtPath);
        return Promise.all(files.map(async evt => {
            const required = require('../client/listeningIn/' + evt);
            delete require.cache[require.resolve(`../client/listeningIn/${evt}`)]
            const event = new required(this.client);
            this.client.on(event.name, (...args) => event.ON(...args));
        }));
    }
}

module.exports.readdir = promisify(fs.readdir);