const fetch = require('node-fetch');

module.exports = class EventUtils {
    constructor(client) {
        this.client = client
        this.keys = [
            {
                uri: 'https://zuraaa.com/bots',
                key: process.env.BPD_TOKEN,
                func: 'BPD_UPDATE',
                name: 'Zuraaa'
            }
        ]
    }

    runningInfo() {
        const Update = async () => {
            this.UpdateInfos();
            return setTimeout(Update, (15 * 60000));
        }

        return Update();
    }

    async UpdateInfos() {
        for (const obj of this.keys) {
            await this[obj.func](obj);
            this.client.LOG('Informations updated successfully', obj.name)
        }
        return true;
    }

    /* eslint-disable-next-line */
    viewVotes() { }

    async BPD_UPDATE(obj) {
        return fetch(`${obj.uri}/${this.client.user.id}/info?guilds=${await this.client.ShardUtils.getGuildsSize()}`, {
            method: 'POST',
            headers: { Authorization: obj.key }
        })
    }
}