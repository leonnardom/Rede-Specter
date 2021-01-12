const moment = require('moment');
require("moment-duration-format");

module.exports = class CommandUtils {
    constructor(client) {
        this.client = client
    }

    getRamUsage() {
        const MemoryHeapUsed = (((process.memoryUsage().heapUsed) / 1024 / 1024).toFixed(2));
        return MemoryHeapUsed + ' MB';
    }

    async getGuildsSize(lang) {
        const GUILDS = await this.client.shard.broadcastEval('this.guilds.size');
        return Number(GUILDS).localeNumber(lang);
    }

    async getUsersSize(lang) {
        const USERS = await this.client.ShardUtils.getMembersSize();
        return Number(USERS).localeNumber(lang);
    }

    async getPing() {
        let PING = await this.client.shard.broadcastEval('this.ping');
        PING = PING[this.client.shard.id].toFixed(0);
        return PING + ' MS';
    }

    async getShard() {
        return (`${(this.client.shard.id + 1)}/${this.client.shard.count}`);
    }

    async getCommandsUsages(lang) {
        let USAGES = await this.client.database.comandos.findAll();
        USAGES = USAGES.map(t => t.usages).reduce((prev, val) => prev + val, 0);
        return Number(USAGES).localeNumber(lang);
    }

    getTime(time = { send: false, ms: this.client.uptime }) {
        return `**${moment.duration(time.ms, 'milliseconds').format('d[d] h[h] m[m] s[s]', { stopTrim: 'd' })}**`;
    }
}