const Command = require("../../structure/Command");
ClientEmbed = require("../../structure/ClientEmbed");
const Emojis = require("../../utils/Emojis");
const Util = require("../../utils/Util");
const User = require("../../database/Schemas/User");
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
      if (!args[0]) {
        const COINS = new ClientEmbed(message.author)
          .setAuthor(
            `${USER.username} - Coins`,
            USER.displayAvatarURL({ dynamic: true })
          )
          .setThumbnail(USER.displayAvatarURL({ dynamic: true, size: 2048 }))
          .addFields(
            {
              name: `${Emojis.Coins} Carteira`,
              value:
                user.coins == 0 ? "Nada" : "R$" + Util.toAbbrev(user.coins),
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

        return message.channel.send(COINS);
      }

      if (message.author.id != process.env.OWNER_ID)
        return message.channel.send(
          `${Emojis.Errado} - ${message.author}, você não tem permissão bobinho(a). ^^`
        );

      const member =
        message.mentions.users.first() || this.client.users.cache.get(args[1]);

      //SET

      if (["set", "setar"].includes(args[0].toLowerCase())) {
        let money = parseInt(args[2]);

        if (!args[1])
          return message.channel.send(
            `${Emojis.Errado} - ${message.author}, modo correto de usar o comando **\`${prefix}coins set <user> <quantia>\`**.`
          );

        if (!member) {
          return message.channel.send(
            `${Emojis.Errado} - ${message.author}, mencione/insira o ID do usuário que deseja setar o dinheiro.`
          );
        } else if (isNaN(args[2])) {
          return message.channel.send(
            `${Emojis.Errado} - ${message.author}, o que você inseriu não é um número, tente novamente.`
          );
        } else {
          message.channel.send(
            `${Emojis.Certo} - ${message.author}, você alterou o dinheiro do(a) **${member}** para **R$${money}** com sucesso.`
          );
          await User.findOneAndUpdate(
            { _id: member.id },
            { $set: { coins: money } }
          );
        }
      }

      //ADD

      if (["add", "adicionar"].includes(args[0].toLowerCase())) {
        let money = parseInt(args[2]);

        if (!args[1])
          return message.channel.send(
            `${Emojis.Errado} - ${message.author}, modo correto de usar o comando **\`${prefix}coins add <user> <quantia>\`**.`
          );

        if (!member) {
          return message.channel.send(
            `${Emojis.Errado} - ${message.author}, mencione/insira o ID do usuário que deseja adicionar o dinheiro.`
          );
        } else if (isNaN(args[2])) {
          return message.channel.send(
            `${Emojis.Errado} - ${message.author}, o que você inseriu não é um número, tente novamente.`
          );
        } else {
          message.channel.send(
            `${Emojis.Certo} - ${message.author}, você adicionou **R$${money}** à conta do **${member}** com sucesso.`
          );
          await User.findOneAndUpdate(
            { _id: member.id },
            { $set: { coins: user.coins + money } }
          );
        }
      }

      //REMOVE

      if (["remove", "remover"].includes(args[0].toLowerCase())) {
        let money = parseInt(args[2]);

        if (!args[1])
          return message.channel.send(
            `${Emojis.Errado} - ${message.author}, modo correto de usar o comando **\`${prefix}coins remover <user> <quantia>\`**.`
          );

        if (!member) {
          return message.channel.send(
            `${Emojis.Errado} - ${message.author}, mencione/insira o ID do usuário que deseja remover dinheiro.`
          );
        } else if (isNaN(args[2])) {
          return message.channel.send(
            `${Emojis.Errado} - ${message.author}, o que você inseriu não é um número, tente novamente.`
          );
        } else if (user.coins < money) {
          return message.channel.send(
            `${Emojis.Errado} - ${message.author}, a quantia de dinheiro do usuário é menor do que a quantia que você deseja remover, tente novamente.`
          );
        } else {
          message.channel.send(
            `${Emojis.Certo} - ${message.author}, você removeu **R$${money}** da conta do **${member}** com sucesso.`
          );
          await User.findOneAndUpdate(
            { _id: member.id },
            { $set: { coins: user.coins - money } }
          );
        }
      }
    });
  }
};
