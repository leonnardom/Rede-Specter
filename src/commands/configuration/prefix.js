const { Command, Emojis, ClientEmbed, ErrorCommand } = require("../../");

class Prefix extends Command {
  constructor(client) {
    super(client, {
      name: "prefix",
      description: "Modifica o prefixo do servidor",
      usage: {
        args: true,
        argsNeed: false,
        argsTxt: "<prefix>",
        need: "{prefix} {cmd} {args}",
      },
      category: "Configuration",
      cooldown: 3000,
      aliases: ["prefixo"],
      Permissions: [],
      UserPermissions: ["MANAGE_GUILD"],
      needGuild: true,
    });
  }

  async run({ channel, message, guild, author, args }, t) {
    const EMBED = new ClientEmbed(author);
    const doc = await this.client.database.guilds.findOne({
      _id: message.guild.id,
    });

    if (args[0]) {
      const PREFIX = args.join(" ");

      if (!(PREFIX.length > 3 || PREFIX.includes(" "))) {
        await this.client.DatabaseUtils.setPrefix(guild, PREFIX).catch(
          (err) => {
            throw new ErrorCommand(err);
          }
        );

        return message.quote(
            `${Emojis.Settings} - **${
              author
            }**, ${t("comandos:prefix.setPrefix", { PREFIX })}`
          )
          
      } else {
        const ERROR =
          PREFIX.length > 3
            ? "comandos:prefix.ultrapassedLength"
            : "comandos:prefix.containsSpaces";
        return message.quote(`${Emojis.Errado} - **${author}**, ${t(ERROR)}`)
      
      }
    } else {
      return message.quote(
          `${Emojis.Errado} - **${author}**, ${t(
            "comandos:prefix.noArgs"
          )}`
        )
  
    }
  }
}

module.exports = Prefix;
