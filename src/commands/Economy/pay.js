const Command = require("../../structure/Command");
ClientEmbed = require("../../structure/ClientEmbed");
const Emojis = require("../../utils/Emojis");
const Util = require("../../utils/Util");
const User = require("../../database/Schemas/User");
const moment = require("moment");
require("moment-duration-format");

module.exports = class Pay extends (
  Command
) {
  constructor(client) {
    super(client);
    this.client = client;

    this.name = "pay";
    this.category = "Economy";
    this.description = "Envie dinheiro para outros membros";
    this.usage = "pay <user> <quantia>";
    this.aliases = ["enviar", "pagar"];

    this.enabled = true;
    this.guildOnly = false;
  }
  async run(message, args, prefix) {
    const USER =
      this.client.users.cache.get(args[0]) || message.mentions.users.first();

    if (!USER)
      return message.channel.send(
        `${Emojis.Errado} - ${message.author}, você deve inserir pra quem deseja enviar dinheiro.`
      );

    User.findOne({ _id: USER.id }, async (err, user) => {
      User.findOne({ _id: message.author.id }, async (err, author) => {
        let quantia = parseInt(args[1]);

        if (!quantia && isNaN(args[1])) {
          return message.channel.send(
            `${Emojis.Errado} - ${message.author}, modo correto de usar o comando: **${prefix}pay <@USER/ID> <QUANTIA>**`
          );
        } else if (author.coins < quantia) {
          return message.channel.send(
            `${Emojis.Errado} - ${message.author}, desculpe mas você não possui essa quantia de dinheiro para enviar.`
          );
        } else {
          message.channel.send(
            `${Emojis.Coins} - ${
              message.author
            }, você enviou **R$${Util.toAbbrev(
              quantia
            )}** para o usuário **${USER}** com sucesso.`
          );
          await User.findOneAndUpdate(
            { _id: message.author.id },
            { $set: { coins: author.coins - quantia } }
          );
          await User.findOneAndUpdate(
            { _id: USER.id },
            { $set: { coins: user.coins + quantia } }
          );
        }
      });
    });
  }
};
