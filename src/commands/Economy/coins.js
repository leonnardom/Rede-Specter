const Command = require("../../structure/Command");
ClientEmbed = require("../../structure/ClientEmbed");
const Emojis = require("../../utils/Emojis");
const Util = require("../../utils/Util");
const User = require("../../database/Schemas/User");
const moment = require("moment");
require("moment-duration-format");

module.exports = class Coins extends (
  Command
) {
  constructor(client) {
    super(client);
    this.client = client;

    this.name = "coins";
    this.category = "Economy";
    this.description = "Veja seus coins";
    this.usage = "coins";
    this.aliases = ["money", "dinheiro"];

    this.enabled = true;
    this.guildOnly = false;
  }
  async run(message, args, prefix) {
    const USER =
      message.mentions.users.first() ||
      this.client.users.cache.get(args[0]) ||
      message.author;

    User.findOne({ _id: USER.id }, async (err, user) => {
      const COINS = new ClientEmbed(message.author)
        .setAuthor(
          `${USER.username} - Coins`,
          USER.displayAvatarURL({ dynamic: true })
        )
        .addFields(
          {
            name: `${Emojis.Coins} Carteira`,
            value: user.coins == 0 ? "Nada" : "R$" + Util.toAbbrev(user.coins),
          },
          {
            name: `${Emojis.Bank} Banco`,
            value: user.bank == 0 ? "Nada" : "R$" + Util.toAbbrev(user.bank),
          },
          {
            name: `${Emojis.Economy} Total`,
            value: "R$" + (user.bank + user.coins).toLocaleString(),
          }
        );

      message.channel.send(COINS);
    });
  }
};
