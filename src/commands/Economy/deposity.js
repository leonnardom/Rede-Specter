const Command = require("../../structure/Command");
ClientEmbed = require("../../structure/ClientEmbed");
const Emojis = require("../../utils/Emojis");
const Util = require("../../utils/Util");
const User = require("../../database/Schemas/User");
const moment = require("moment");
require("moment-duration-format");

module.exports = class Deposity extends (
  Command
) {
  constructor(client) {
    super(client);
    this.client = client;

    this.name = "deposity";
    this.category = "Economy";
    this.description = "Deposite seu dinheiro no banco";
    this.usage = "depositar <quantia/all>";
    this.aliases = ["depositar", "deep", "dep"];

    this.enabled = true;
    this.guildOnly = false;
  }
  async run(message, args, prefix) {
    User.findOne({ _id: message.author.id }, async (err, user) => {
      if (!args[0])
        return message.channel.send(
          `${Emojis.Errado} - ${message.author} modo de usar o comando: **${prefix}depositar <quantia/tudo>**`
        );

      if (user.coins == 0) {
        return message.channel.send(
          `${Emojis.Economy} - ${message.author}, você não tem coins para depositar.`
        );
      }

      let aliases = ["tudo", "all"];
      let quantia = parseInt(args[0]);

      if (aliases.some((x) => args[0] == x)) {
        return message.channel
          .send(
            `${Emojis.Certo} - ${
              message.author
            }, você depositou **R$${Util.toAbbrev(
              user.coins
            )}** com sucesso em seu banco.`
          )
          .then(async (x) => {
            await User.findOneAndUpdate(
              { _id: message.author.id },
              { $set: { bank: user.bank + user.coins, coins: 0 } }
            );
          });
      } else {
        if (!quantia && isNaN(args[0])) {
          return message.channel.send(
            `${Emojis.Errado} - ${message.author}, você deve inserir quanto deseja depositar.`
          );
        } else if (user.coins < quantia) {
          return message.channel.send(
            `${Emojis.Economy} - ${message.author}, desculpe mas você não possui essa quantia para depositar, no momento você tem **R$${user.coins}**.`
          );
        } else {
          message.channel.send(
            `${Emojis.Bank} - ${message.author}, você depositou com sucesso **R$${quantia}**.`
          );
          await User.findOneAndUpdate(
            { _id: message.author.id },
            { $set: { bank: user.bank + quantia, coins: user.coins - quantia } }
          );
        }
      }
    });
  }
};
