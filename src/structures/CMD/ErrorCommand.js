const ClientEmbed = require("../ClientEmbed.js");

module.exports = class CommandError extends Error {
    constructor(message) {
        super(message);
    }

    static async commandError(client, channel, command, used, prefix, t, error, { displayAvatarURL } = client.user) {
        try {
            const support = await client.utils.get('links', 'support').then(({ redirect }) => redirect);
            return channel.send(new ClientEmbed(used)
                .setAuthor(client.user.username, client.user.displayAvatarURL({dynamic: true}))
                .setDescription(t('errors:CommandError.description', { prefix: prefix, support }))
                .setFooter(t('errors:CommandError.footer', { user: client.user.username }), used.displayAvatarURL({dynamic: true}) ? used.displayAvatarURL({dynamic: true}) : displayAvatarURL({dynamic: true}))
                .setColor(process.env.ERROR_COLOR)
            ).then(() => {
                const embed = new ClientEmbed(used);
                const channel = (JSON.parse(process.env.UTILS_LOGS)['ERROR']);

                if (channel.guild) {
                    embed.addField("No Servidor:", channel.guild.name + ' `(' + channel.guild.id + ')`', true)
                }

                client.ShardUtils.send(process.env.GUILD_ID, channel
                    , embed
                        .setColor(process.env.ERROR_COLOR)
                        .setTitle("Erro ao executar um Comando")
                        .addField("Comando", command.commandHelp.name, true)
                        .addField("Usado Por:", used.tag, true)
                        .addField("Erro", error.message ? error.message : error)
                        .setThumbnail(channel.guild && channel.guild.iconURL({dynamic: true}) ? channel.guild.iconURL({dynamic: true}) : used.displayAvatarURL({dynamic: true}))
                )
                return client.LOG_ERR(error, command.commandHelp.name.toUpperCase());
            }).catch(client.LOG_ERR)
        } catch (err) {
            return client.LOG_ERR(err);
        }
    }
}