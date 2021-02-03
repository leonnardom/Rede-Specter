const Command = require("../../structure/Command");
ClientEmbed = require("../../structure/ClientEmbed");
Emojis = require("../../utils/Emojis");
const Gamedig = require("gamedig");
const Util = require("../../utils/Util");
const { User } = require("discord.js");
module.exports = class Help extends (
  Command
) {
  constructor(client) {
    super(client);
    this.client = client;

    this.name = "avatar";
    this.category = "Information";
    this.description = "Veja o avatar do usuário.";
    this.usage = "avatar [user]";
    this.aliases = ["avt"];

    this.enabled = true;
    this.guildOnly = false;
  }
  async run(message, args, prefix) {
    const USER =
      this.client.users.cache.get(args[0]) ||
      message.mentions.users.first() ||
      message.author;

    const EMBED = new ClientEmbed(message.author)
      .addFields({
        name: USER.username,
        value: `Clique **[aqui](${USER.displayAvatarURL({
          dynamic: true,
          size: 2048,
          format: "jpg",
        })})** para baixar o avatar`,
      })
      .setImage(
        USER.displayAvatarURL({ dynamic: true, size: 2048, format: "jpg" })
      );

    message.channel.send(EMBED);
  }
};
