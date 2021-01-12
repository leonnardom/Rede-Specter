const { Command, Emojis, ClientEmbed, EvaledCommand } = require("../../");

class Eval extends Command {
    constructor(client) {
        super(client, {
            name: "eval",
            description: "Executa códigos em JS",
            usage: { args: true, argsNeed: true, argsTxt: "<code>", need: "{prefix} {cmd} {args}" },
            category: "Developer",
            cooldown: 3000,
            aliases: ["e"],
            Permissions: [],
            UserPermissions: [],
            devNeed: true,
            needGuild: false
        });
    }

    async run(settings, t, { author, channel, args } = settings) {
        const CODE = async () => {
            const EvaledCMD = new EvaledCommand(this.client);
            const Evaled = await EvaledCMD.getEvaled(settings, args, t);

            if (Evaled.result.length > 1000) {
                console.log('\n-\n______________________________________\n')
                console.log(Evaled.result)
                console.log('\n' + '--------------------------------------\n-\n')
                Evaled.result = Evaled.result.slice(0, 1000) + '\n[...]'
            }
            const evalTransform = await this.evalTransform(Evaled);
            return { evalTransform };
        }

        if (args[0]) {
            const { evalTransform } = await CODE();

            return channel.send(evalTransform).catch(() => { });
        } else {
            return channel.send(new ClientEmbed(author)
                .setDescription(`${Emojis.Errado} **${author.username}**, ` + t('errors:noArgs'))
                .setColor(process.env.ERROR_COLOR)
            ).catch(() => { });
        }
    }

    evalTransform({ code, result }) {
        return '📤' + '\n' + '```' + code + '\n' + result + '\n```';
    }
}

module.exports = Eval;