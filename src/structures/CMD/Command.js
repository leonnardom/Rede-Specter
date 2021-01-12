const ErrorCommand = require("./ErrorCommand.js");
const TestCommand = require("./TestCommand.js");

module.exports = class Command extends TestCommand {
    constructor(client, options, subcommand = false) {
        super(client);

        this.client = client
        this.name = options.name || "Sem Nome"
        this.description = options.description || "Nenhuma"
        this.category = options.category || "Nenhuma"
        this.aliases = options.aliases || []

    }

    async _run(settings, { channel, command, author, prefix, t } = settings) {
        try {
            await this.run(settings, t);
            return true;
        } catch (e) {
            return ErrorCommand.commandError(
                this.client,
                channel,
                command,
                author,
                prefix,
                t,
                e
            )
        }
    }
}