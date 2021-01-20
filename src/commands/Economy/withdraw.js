const Command = require("../../structure/Command");
ClientEmbed = require("../../structure/ClientEmbed");
const Emojis = require("../../utils/Emojis");
const Util = require("../../utils/Util");
const User = require("../../database/Schemas/User");
require("moment-duration-format");

module.exports = class Withdraw extends (
  Command
) {
  constructor(client) {
    super(client);
    this.client = client;

    this.name = "withdraw";
    this.category = "Economy";
    this.description = "Saque seu dinheiro no banco";
    this.usage = "sacar <quantia/all>";
    this.aliases = ["sacar", "tirar"];

    this.enabled = true;
    this.guildOnly = false;
  }
  async run(message, args, prefix) {
    User.findOne({ _id: message.author.id }, async (err, user) => {
      if (!args[0])
        return message.channel.send(
          `${Emojis.Errado} - ${message.author} modo de usar o comando: **${prefix}sacar <quantia/tudo>**`
        );

      if (user.bank == 0) {
        return message.channel.send(
          `${Emojis.Economy} - ${message.author}, você não tem coins para sacar.`
        );
      }

      let aliases = ["tudo", "all"];
      let quantia = parseInt(args[0]);

      if (aliases.some((x) => args[0] == x)) {
        return message.channel
          .send(
            `${Emojis.Certo} - ${
              message.author
            }, você sacou **R$${Util.toAbbrev(
              user.bank
            )}** com sucesso do seu banco.`
          )
          .then(async () => {
            await User.findOneAndUpdate(
              { _id: message.author.id },
              { $set: { bank: 0, coins: user.bank + user.coins } }
            );
          });
      } else {
        if (!quantia && isNaN(args[0])) {
          return message.channel.send(
            `${Emojis.Errado} - ${message.author}, você deve inserir quanto deseja sacar.`
          );
        } else if (user.bank < quantia) {
          return message.channel.send(
            `${Emojis.Economy} - ${
              message.author
            }, desculpe mas você não possui essa quantia para sacar, no momento você tem **R$${user.bank.toLocaleString()}**.`
          );
        } else {
          message.channel.send(
            `${Emojis.Bank} - ${
              message.author
            }, você sacou com sucesso **R$${quantia.toLocaleString()}**.`
          );
          await User.findOneAndUpdate(
            { _id: message.author.id },
            { $set: { bank: user.bank - quantia, coins: user.coins + quantia } }
          );
        }
      }
    });
  }
};
