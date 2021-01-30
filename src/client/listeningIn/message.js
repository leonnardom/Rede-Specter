const GetMention = (id) => new RegExp(`^<@!?${id}>( |)$`);
const User = require("../../database/Schemas/User");
Client = require("../../database/Schemas/Client");
Guild = require("../../database/Schemas/Guild");

module.exports = class {
  constructor(client) {
    this.client = client;
  }

  async run(message) {
    User.findOne({ _id: message.author.id }, async (err, user) => {
      Client.findOne({ _id: this.client.user.id }, async (err, bot) => {
        Guild.findOne({ _id: message.guild.id }, async (err, server) => {
          if (message.author.bot) return;

          if (user) {
            if (bot) {
              if (server) {
                const prefix = "!";

                if (message.content.match(GetMention(this.client.user.id))) {
                  message.channel.send(
                    `Olá ${message.author}.\nSou o Bot Oficial da **${process.env.SERVER_NAME}**, caso queira saber minha lista de comandos use **${prefix}ajuda**`
                  );
                }

                if (message.content.indexOf(prefix) !== 0) return;
                const args = message.content
                  .slice(prefix.length)
                  .trim()
                  .split(/ +/g);
                const command = args.shift().toLowerCase();

                if (message.guild && !message.member)
                  await message.guild.fetchMember(message.author);

                const cmd =
                  this.client.commands.get(command) ||
                  this.client.commands.get(this.client.aliases.get(command));
                if (!cmd) return message.channel.send("Command not found.");

                const cmdblock = server.cmdblock;

                if (cmdblock.status) {
                  if (
                    !message.member.hasPermission("MANAGE_GUILD") ||
                    !message.member.hasPermission("ADMINISTRATOR") ||
                    !message.member.hasPermission("MANAGE_CHANNELS")
                  )
                    if (
                      !cmdblock.channels.some((x) => x === message.channel.id)
                    ) {
                      if (!cmdblock.enable.some((x) => x === cmd.name)) {
                        return message.channel.send(
                          `${Emojis.Errado} - ${message.author}, não pode usar comandos aqui bobinho(a). ^^`
                        );
                      }
                    }
                }

                cmd.run(message, args, prefix);
              } else {
                Guild.create({ _id: message.guild.id });
              }
            } else {
              Client.create({ _id: this.client.user.id });
            }
          } else {
            User.create({ _id: message.author.id });
          }
        });
      });
    });
  }
};
