module.exports = class ClientUtils {
    constructor(client) {
        this.name = 'ClientUtils'
        this.client = client
        this.utils = {
            all: new client.collection,
            get: async(name, find) => {
                if (!name || !find) return false;
                return await this.utils.all.get(name).find(({ name }) => name === find);
            }
        }
    }

    async call() {
        this.client.utils = this.utils;
        return this.loadAllUtils()
            .then(() => this.client.LOG('Successfully loaded!', 'ClientUtils'));
    }

    async loadAllUtils() {
        const UtilsArray = ["links"];

        for (const util of UtilsArray) {
            let error = false;
            try {
                await require(`../client/utils/${util}.js`);
            } catch (err) {
                error = true;
                throw this.client.LOG_ERR(this.name, util.toUpperCase(), err.message)
            } finally {
                if (!error) {
                    const required = require(`../client/utils/${util}.js`);
                    const NewUtil = new required(this.client.utils);
                    NewUtil.load();
                }
            }
        }
        return true;
    }
}