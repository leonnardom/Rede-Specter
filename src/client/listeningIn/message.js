const { ClientEmbed, CommandContext, Emojis } = require("../../");
const Event = require("../../structures/Event.js");
const cold = new Set();
const GetMention = (id) => new RegExp(`^<@!?${id}>( |)$`);
const GetPrefix = (m, p) => p.find((pr) => m.content.startsWith(pr));
let moment = require("moment");

module.exports = class MessageDelete extends (
  Event
) {
  constructor(client) {
    super(client);
    this.client = client;
    this.name = "message";
  }

  async ON(message) {
    const doc1 = await this.client.database.users.findOne({
      _id: message.author.id,
    });

    if (
      !(
        this.client.database.guilds ||
        this.client.database.users ||
        this.client.database.comandos
      ) ||
      (message.author.bot && message.author.id !== this.client.user.id)
    )
      return;

    const { prefix } = message.guild
      ? await this.client.database.guilds.get(message.guild.id)
      : {
          prefix: process.env.PREFIX,
        };

    const Prefixes = [
      prefix,
      `<@!${this.client.user.id}>`,
      ` <@${this.client.user.id}>`,
    ];
    const Prefix = GetPrefix(message, Prefixes);

    if (message.content.match(GetMention(this.client.user.id)) || Prefix) {
      const {
        contributor: { developer, owner },
      } = await this.client.database.users.get(message.author.id);

      if (
        message.content.match(GetMention(this.client.user.id))) {
        return message.channel
          .send(
            ` :robot: Olá! Eu sou o *${this.client.user.username}* e estou aqui para te ajudar! :robot:\nPara começar, o meu prefixo é / e com o comando /ajuda tu consegue ver todos os comandos disponíveis! `
          )

          .catch(() => {});
      }

      if (Prefix && message.content.length > Prefix.length) {
        const args = message.content.slice(Prefix.length).trim().split(/ +/g);
        const cmdInsert = args.shift();
        const command = this.client.commands.all.find(
          (cmd) =>
            cmd.commandHelp.name.toLowerCase() === cmdInsert.toLowerCase() ||
            (cmd.commandHelp.aliases &&
              cmd.commandHelp.aliases.includes(cmdInsert.toLowerCase()))
        );

        if (command) {
          if (!cold.has(message.author.id)) {
            const { aproved, because } = await this.VerifyCommand(
              {
                developer,
                owner,
              },
              command,
              cooldownCMD()
            );
          } else {
            return message.channel.send(`cooldown`).then((colldown) => {
              setTimeout(() => {}, 3000);
            });
          }

          const settings = new CommandContext({
            client: this.client,
            aliase: cmdInsert,
            usedPrefix: Prefix,
            developer: owner ? owner : developer ? developer : false,
            owner: owner,
            command,
            logschannel,
            prefix,

            message,
            args,
          });

          return command.commandHelp
            .verify(settings)
            .then(() => {
              return this.UserUtils(message.author).then(() =>
                this.CommandUtils(command)
              );
            })
            .catch(this.client.LOG_ERR);

          async function cooldownCMD() {
            if (doc.contributor.owner) {
              cold.add(message.author.id);
              setTimeout(function () {
                cold.delete(message.author.id);
              }, 5000);
            }
          }
        }
      }
    }
  }
};
