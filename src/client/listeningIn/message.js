const Guild = require("../../database/Schemas/Guild");
const GetMention = (id) => new RegExp(`^<@!?${id}>( |)$`);
const GetPrefix = (x, z) => z.find((xz) => x.content.startsWith(xz));
const ClientEmbed = require("../../structures/ClientEmbed"),
  Emojis = require("../../utils/Emojis");

module.exports = class {
  constructor(client) {
    this.client = client;
  }

  async run(message) {
    if (message.author.bot == true) return;

    let prefix;
    prefix = ".";

    const Prefixes = [
      prefix,
      `<@!${this.client.user.id}>`,
      ` <@${this.client.user.id}>`,
    ];

    const Prefix = GetPrefix(message, Prefixes);

    if (message.content.match(GetMention(this.client.user.id))) {
      message.channel.send(
        `${Emojis.Certo} - ${message.author}, Olá.\nEu sou o Bot Oficial da **${process.env.SERVER_NAME}**, caso queira saber meus comandos use **\`${prefix}ajuda\`**.`
      );
    }

    if (message.content.indexOf(prefix) !== 0) return;
    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    if (message.guild && !message.member)
      await message.guild.fetchMember(message.author);

    const cmd =
      this.client.commands.get(command) ||
      this.client.commands.get(this.client.aliases.get(command));
    if (!cmd)
      return message.channel.send(
        `${Emojis.Errado} - ${message.author}, desculpe, não encontrei este comando.`
      );
    cmd.run(message, args);
  }
};
