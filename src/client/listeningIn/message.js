const GetMention = (id) => new RegExp(`^<@!?${id}>( |)$`);
const User = require("../../database/Schemas/User");

module.exports = class {
  constructor(client) {
    this.client = client;
  }

  async run(message) {
    User.findOne({ _id: message.author.id }, async (err, user) => {
      if (message.author.bot) return;

      if (user) {
        const prefix = "!";

        if (message.content.match(GetMention(this.client.user.id))) {
          message.channel.send(
            `Olá ${message.author}.\nSou o Bot Oficial da **${process.env.SERVER_NAME}**, caso queira saber minha lista de comandos use **${prefix}ajuda**`
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
        if (!cmd) return message.channel.send("Command not found.");
        cmd.run(message, args, prefix);
      } else {
        User.create({ _id: message.author.id });
      }
    });
  }
};
