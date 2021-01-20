const Command = require("../../structure/Command");
ClientEmbed = require("../../structure/ClientEmbed");
const Emojis = require("../../utils/Emojis");
const Util = require("../../utils/Util");
const User = require("../../database/Schemas/User");
const moment = require("moment");
require("moment-duration-format");

module.exports = class Daily extends (
  Command
) {
  constructor(client) {
    super(client);
    this.client = client;

    this.name = "daily";
    this.category = "Economy";
    this.description = "Pegue sua recompensa diária";
    this.usage = "daily";
    this.aliases = ["diário"];

    this.enabled = true;
    this.guildOnly = false;
  }
  async run(message, args, prefix) {
    User.findOne({ _id: message.author.id }, async (err, user) => {
      let cooldown = 86400000;
      let coins = Math.floor(Math.random() * 10000) + 1000;
      let daily = user.daily;
      let time = cooldown - (Date.now() - daily);

      if (daily !== null && cooldown - (Date.now() - daily) > 0) {
        return message.channel.send(
          `${Emojis.Cooldown} - ${
            message.author
          }, você deve aguardar **${moment
            .duration(time)
            .format("h [horas], m [minutos] e s [segundos]")
            .replace(
              "minsutos",
              "minutos"
            )}** para pegar sua recompensa diária novamente.`
        );
      } else {
        message.channel.send(
          `${Emojis.Coins} - ${
            message.author
          }, você conseguiu **R$${Util.toAbbrev(
            coins
          )}** em seu **daily** hoje.`
        );
        await User.findOneAndUpdate(
          { _id: message.author.id },
          { $set: { coins: user.coins + coins, daily: Date.now() } }
        );
      }
    });
  }
};
