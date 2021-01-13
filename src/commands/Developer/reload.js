const { Command, Emojis, ClientEmbed } = require("../../");

class Reload extends Command {
    constructor(client) {
        super(client, {
            name: "reload",
            description: "Recarrega o comando inserido",
            usage: { args: true, argsNeed: true, argsTxt: "<command>", need: "{prefix} {cmd} {args}" },
            category: "Developer",
            cooldown: 3000,
            aliases: ["r", "rl"],
            Permissions: [],
            UserPermissions: [],
            devNeed: true,
            needGuild: false
        });
    }

    async run({ channel, author, args }, t) {
        const EMBED = new ClientEmbed(author);
        const CMD = args[0] ? this.client.commands.all.find(cmd => (
            cmd.commandHelp.name.toLowerCase() === args.join(' ').toLowerCase()
        ) || (
                cmd.commandHelp.aliases && cmd.commandHelp.aliases.includes(args.join(' ').toLowerCase())
            )
        ) : false

        if (args[0] && CMD) {
            const { error, errorEmit } = await this.client.commands.load(CMD, t);
            const STATUS = (error ? 'comandos:reload.error' : 'comandos:reload.reloaded');

            if (error) EMBED.setColor(process.env.ERROR_COLOR);

            return channel.send(EMBED
                .setDescription(`${error ? Emojis.Errado : Emojis.Certo} **${author.username}**, ${t(STATUS, { err: errorEmit.message, cmd: CMD.commandHelp.name })}`)
            )
        } else {
            const ERROR = (args[0] ? 'comandos:reload.noCommand' : 'comandos:reload.noArgs');
            return channel.send(EMBED
                .setDescription(`${Emojis.Errado} **${author.username}**, ${t(ERROR, { cmd: args.join(' ') })}`)
                .setColor(process.env.ERROR_COLOR)
            )
        }
    }
}

module.exports = Reload;