const ErrorCommand = require("./ErrorCommand.js");
const TestCommand = require("./TestCommand.js");

module.exports = class Command extends TestCommand {
    constructor(client, options, subcommand = false) {
        super(client);

        this.client = client
        this.name = options.name || "Sem Nome"
        this.description = options.description || "Nenhuma"
        this.usage = options.usage || { args: false, argsNeed: false }
        this.category = options.category || "Nenhuma"
        this.aliases = options.aliases || []
        this.Permissions = options.Permissions || ["SEND_MESSAGES"]
        this.UserPermissions = options.UserPermissions || []
        this.subcommand = subcommand

        if (subcommand) {
            this.referenceCommand = options.referenceCommand || this.client.Error('No command reference!');
        } else {
            this.cooldownTime = options.cooldown || 5000
            this.devNeed = options.devNeed !== undefined ? options.devNeed : false
            this.ownerNeed = options.ownerNeed !== undefined ? options.ownerNeed : false
            this.needGuild = options.needGuild !== undefined ? options.needGuild : true
            this.vipUser = options.vipUser !== undefined ? options.vipUser : false
            this.cooldown = new Map();
        }
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