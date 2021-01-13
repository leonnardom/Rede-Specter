const { Command, Emojis, ClientEmbed, ErrorCommand } = require("../../../");

class ClientMaintence extends Command {
    constructor(client) {
        super(client, {
            name: "bot",
            description: "",
            usage: { args: false, argsNeed: false },
            category: "Developer",
            aliases: ["client", "me"],
        });
    }

    async run({ channel, author }, t, opt) {
        const EMBED = new ClientEmbed(author);
        const CLIENT = await this.client.database.clientUtils.get(this.client.user.id);
        const BOOLEAN = opt.boolean === CLIENT.maintence;
        if (BOOLEAN) {
            return channel.send(EMBED
                .setDescription(`${Emojis.Errado} **${author.username}**, ${t(`comandos:maintencecmd.subcommands.client.false${opt.type}`)}`)
                .setColor(process.env.ERROR_COLOR)
            )
        } else {
            await this.client.DatabaseUtils['ClientMaintence'](opt.boolean)
                .catch((err) => { throw new ErrorCommand(err) });

            return channel.send(EMBED
                .setDescription(`${Emojis.Certo} **${author.username}**, ${t(`comandos:maintencecmd.subcommands.client.true${opt.type}`)}`)
            )
        }
    }
}

module.exports = ClientMaintence;