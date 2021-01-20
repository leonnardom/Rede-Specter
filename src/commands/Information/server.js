const Command = require("../../structure/Command");
ClientEmbed = require("../../structure/ClientEmbed");
Emojis = require("../../utils/Emojis");
const Gamedig = require("gamedig");
const Util = require('../../utils/Util')
module.exports = class Help extends (
  Command
) {
  constructor(client) {
    super(client);
    this.client = client;

    this.name = "server";
    this.category = "Information";
    this.description = "Veja as informações do servidor.";
    this.usage = "server";
    this.aliases = ["servidor"];

    this.enabled = true;
    this.guildOnly = false;
  }
  async run(message, args, prefix) {
    const SERVER = new ClientEmbed(message.author);

    Gamedig.query({
      type: "minecraft",
      host: `redespecter.com`,
    }).then((state) => {
      message.channel.send(
        SERVER.addFields(
          {
            name: `MOTD`,
            value: state.name,
          },
          {
            name: `Players Online`,
            value: !state.players.length
              ? "Nenhum Player Online no Momento"
              : state.players.length,
          },
          {
            name: `Ping`,
            value: state.raw.vanilla.ping + "ms",
          }
        )
          .setAuthor(
            `Informações do Servidor`,
            "https://cdn.discordapp.com/icons/794641040631005215/8a1a250f187969a9dbfcec198b8afebe.webp?size=2048"
          )
          .setThumbnail(
            "https://cdn.discordapp.com/icons/794641040631005215/8a1a250f187969a9dbfcec198b8afebe.webp"
          )
      );
    });
  }
};
