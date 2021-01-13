const Emojis = require("../../utils/Emojis.js"),
    ClientEmbed = require("../ClientEmbed.js");

const { inspect } = require('util');

module.exports = class EvaledCommand {
    constructor(client) {
        this.client = client
        this.REPLACES = [
            process.env.TOKEN,
            process.env.PASTEBIN_API,
            process.env.MONGODB_URI,
            process.env.BPD_TOKEN,
            process.env.DBL_TOKEN
        ]
    }

    async getEvaled({ author, owner, channel, guild, message }, args, t, code = args.join(' ')) {
        let RESULT;
        let ERRROR_EMIT = false;

        try {
            if (code.includes('send') && code.includes('process.env') && !owner) {
                RESULT = 'I will not send my private information!'
                ERRROR_EMIT = true;
            } else {
                RESULT = await eval(code);
            }
        } catch (err) {
            err = err.message;
            RESULT = err;
            ERRROR_EMIT = true;
        } finally {
            RESULT = typeof RESULT !== 'string' ? inspect(RESULT, { depth: 0 }) : RESULT;

            let resultCheck = RESULT; (typeof resultCheck === 'object' ? JSON.stringify(resultCheck) : resultCheck);

            if (code.includes('process.env') || this.REPLACES.some(rs => resultCheck.includes(rs))) {
                const RES = await this.replaceProcess(RESULT);
                RESULT = RES;
            }
            RESULT = ERRROR_EMIT ? RESULT : this.clean(RESULT);
            return { code: ERRROR_EMIT ? 'xl' : 'js', result: RESULT };
        }
    }

    async replaceProcess(RESULT) {
        try {
            let BACKUP = RESULT;
            RESULT = (typeof RESULT === 'object' ? JSON.stringify(RESULT) : RESULT);

            for (const txt of this.REPLACES) {
                if (RESULT.includes(txt)) RESULT = RESULT.replace(txt, '*'.repeat(txt.length));
            }

            return typeof BACKUP === 'object' ? JSON.parse(RESULT) : RESULT;
        } catch (e) {
            throw new Error(e);
        }
    }

    clean(text) {
        const blankSpace = String.fromCharCode(8203)
        return typeof text === 'string' ? text.replace(/`/g, '`' + blankSpace).replace(/@/g, '@' + blankSpace) : text
    }
}