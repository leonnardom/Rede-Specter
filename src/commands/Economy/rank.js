const Command = require("../../structure/Command");
ClientEmbed = require("../../structure/ClientEmbed");
const Emojis = require("../../utils/Emojis");
const Util = require("../../utils/Util");
const User = require("../../database/Schemas/User");
const moment = require("moment");
require("moment-duration-format");

module.exports = class Rank extends (
  Command
) {
  constructor(client) {
    super(client);
    this.client = client;

    this.name = "rank";
    this.category = "Economy";
    this.description = "Veja o rank de coins";
    this.usage = "rank";
    this.aliases = [];

    this.enabled = true;
    this.guildOnly = false;
  } 
  async run(message, args, prefix) {
    await require("mongoose")
      .connection.collection("users")
      .find({ bank: { $gt: 0 } })
      .toArray((err, res) => {
        if (err) throw err;

        let top_users = res.sort((x, f) => f.bank - x.bank);

        const TOP = new ClientEmbed(message.author)
          .setAuthor(`${Emojis.Rank} - Ranking Monetário`)
          .setDescription(
            `${top_users
              .map(
                (x, f) =>
                  `${
                    f + 1 == 1
                      ? `${Emojis.First} 1`
                      : f + 1 == 2
                      ? `${Emojis.Second} 2`
                      : f + 1 == 3
                      ? `${Emojis.Third} 3`
                      : `${Emojis.Medal} ${f + 1}`
                  }º: <@${x._id}> - Coins ( **${Util.toAbbrev(x.bank)}** )`
              )
              .join("\n")}`
          );

        message.channel.send(TOP);
      });
  }
};
