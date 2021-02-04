const Command = require("../../structure/Command");
ClientEmbed = require("../../structure/ClientEmbed");
const Emojis = require("../../utils/Emojis");

module.exports = class Coins extends (
  Command
) {
  constructor(client) {
    super(client);
    this.client = client;

    this.name = "sugerir";
    this.category = "Misc";
    this.description = "Faça uma sugestão para o servidor";
    this.usage = "sugerir";
    this.aliases = ["sugestão"];

    this.enabled = true;
    this.guildOnly = false;
  }
  async run(message, args, prefix, utils) {
    message.channel
      .send(
        `${Emojis.Certo} - ${message.author}, qual a sugestão que você deseja enviar?\n\nCaso deseje cancelar a ação basta digitar: **\`cancelar\`**.`
      )
      .then(async (msg) => {
        let collector = msg.channel.createMessageCollector(
          (m) => m.author.id === message.author.id,
          { max: 1, time: 600000 }
        );

        collector.on("collect", async (collected) => {
          if (
            ["cancelar", "cancel"].includes(collected.content.toLowerCase())
          ) {
            message.channel.send(
              `${Emojis.Certo} - ${message.author}, ação cancelada com sucesso.`
            );

            return collector.stop();
          }
          message.channel.send(
            `${Emojis.Certo} - ${message.author}, sugestão enviada com sucesso.`
          );

          const EMBED = new ClientEmbed(this.client.user)
            .setAuthor(`${Emojis.Find} || Sugestões`)
            .addFields(
              {
                name: `${Emojis.User} Autor`,
                value: message.author.tag,
              },
              {
                name: `${Emojis.Sugestion} Sugestão`,
                value: collected.content,
              }
            )
            .setThumbnail(
              message.author.displayAvatarURL({ dynamic: true, size: 2048 })
            )
            .setFooter(`Enviada em`)
            .setTimestamp();

          await this.client.channels.cache
            .get(process.env.SUGESTION)
            .send(EMBED)
            .then(async (msg) => {
              await msg.react(Emojis.reactions.yes);
              await msg.react(Emojis.reactions.no);
            });
          msg.delete();
        });
        msg.delete();
      });
    message.delete().catch(() => {});
  }
};
