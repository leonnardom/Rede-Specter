const { UserFlags, Client } = require("discord.js");
const Command = require("../../structure/Command");
const Emojis = require("../../utils/Emojis");
ClientEmbed = require("../../structure/ClientEmbed");
const msgTimeOut = async (msg, time) => {
  await new Promise(function (resolve, reject) {
    setTimeout(resolve, time);
  });
  return msg.reactions.removeAll().catch(() => {});
};

module.exports = class Help extends (
  Command
) {
  constructor(client) {
    super(client);
    this.client = client;

    this.name = "help";
    this.category = "Bot";
    this.description = "Veja a Lista de comandos do Bot";
    this.usage = "help <comando>";
    this.aliases = ["ajuda"];

    this.enabled = true;
    this.guildOnly = false;
  }
  async run(message, args, prefix) {
    const Bot = [];
    const Owner = [];
    const Information = [];
    const Economy = [];
    const Misc = [];

    const { commands } = message.client;

    const AJUDA = new ClientEmbed(message.author)
      .setAuthor(
        `Central de Ajuda do Bot`,
        this.client.user.displayAvatarURL({ size: 2048 })
      )
      .setThumbnail(this.client.user.displayAvatarURL({ size: 2048 }));

    if (args[0]) {
      const name = args[0].toLowerCase();
      const comando =
        commands.get(name) ||
        commands.find((cmd) => cmd.aliases && cmd.aliases.includes(name));

      if (!comando) {
        return message.channel.send(
          `${message.author}, não achei nenhum comando com o nome/aliases **\`${name}\`**.`
        );
      }

      AJUDA.addField(`${Emojis.Comando} Comando:`, comando.name);

      if (comando.aliases)
        AJUDA.addField(
          `${Emojis.Aliases} Aliases`,
          !comando.aliases.length ? "Nenhum" : comando.aliases.join(", ")
        );
      if (comando.description)
        AJUDA.addField(
          `${Emojis.Desc} Descrição`,
          !comando.description.length ? "Nenhuma" : comando.description
        );
      if (comando.usage)
        AJUDA.addField(
          `${Emojis.Uso} Modo de Uso`,
          !comando.usage.length ? "Nenhum" : comando.usage
        );

      message.channel.send(AJUDA);
    } else {
      commands.map((cmd) => {
        if (cmd.category === "Bot")
          Bot.push({
            name: cmd.name,
            aliases: cmd.aliases,
            desc: cmd.description,
          });
        else if (cmd.category == "Owner")
          Owner.push({
            name: cmd.name,
            aliases: cmd.aliases,
            desc: cmd.description,
          });
        else if (cmd.category == "Information")
          Information.push({
            name: cmd.name,
            aliases: cmd.aliases,
            desc: cmd.description,
          });
        else if (cmd.category == "Economy")
          Economy.push({
            name: cmd.name,
            aliases: cmd.aliases,
            desc: cmd.description,
          });
        else if (cmd.category == "Misc")
          Misc.push({
            name: cmd.name,
            aliases: cmd.aliases,
            desc: cmd.description,
          });
        else
          Bot.push({
            name: cmd.name,
            aliases: cmd.aliases,
            desc: cmd.description,
          });
      });

      const HELP = new ClientEmbed(message.author)
        .setAuthor(
          `Central de Ajuda do Bot`,
          this.client.user.displayAvatarURL({ size: 2048 })
        )
        .setDescription(
          `${Emojis.User} - **${message.author.tag}**, aqui você irá encontrar todos os meus comandos, para saber mais sobre algum comando use **\`${prefix}help <comando/aliases>\`**\nNo momento tenho **${this.client.commands.size} comandos**.\n\n${Emojis.One} | Comandos do **Bot**\n${Emojis.Two} | Comandos de **Informação**\n${Emojis.Three} | Comandos de **Economia**\n${Emojis.Four} | Comandos sem **Categoria**\n${Emojis.Five} | Comandos **Restritos**\n\n${Emojis.Back} | Volta a **Página Inicial**\n${Emojis.Errado} | Deleta a **Mensagem**`
        )
        .setThumbnail(this.client.user.displayAvatarURL({ size: 2048 }));

      await message.channel.send(HELP).then(async (msg) => {
        msg.react(Emojis.One);
        msg.react(Emojis.Two);
        msg.react(Emojis.Three);
        msg.react(Emojis.Four);
        msg.react(Emojis.Five);
        msg.react(Emojis.Back);
        msg.react(Emojis.Errado);

        const filter = (reaction, user) =>
          [
            Emojis.One,
            Emojis.Two,
            Emojis.Three,
            Emojis.Four,
            Emojis.Five,
            Emojis.Back,
            Emojis.Errado,
          ].includes(reaction.emoji.name) && user.id === message.author.id;

        const collector = msg.createReactionCollector(filter, { time: 120000 });

        msgTimeOut(msg, 120000);

        collector.on("collect", async (r) => {
          switch (r.emoji.name) {
            case Emojis.One: {
              const E1 = new ClientEmbed(message.author)
                .addField(
                  `${Emojis.Robo} Comandos do Bot`,
                  Bot.map(
                    (x) =>
                      `\`${prefix}${x.name}${
                        !x.aliases.length
                          ? ""
                          : ` [${x.aliases.map((x) => x).join(", ")}]`
                      }\` - ${x.desc}`
                  ).join("\n")
                )
                .setThumbnail(
                  this.client.user.displayAvatarURL({ size: 2048 })
                );

              r.users.remove(r.users.cache.last());

              msg.edit(E1);
              break;
            }

            case Emojis.Two: {
              const E2 = new ClientEmbed(message.author)
                .addField(
                  `${Emojis.Information} Comandos de Informação`,
                  Information.map(
                    (x) =>
                      `\`${prefix}${x.name}${
                        !x.aliases.length
                          ? ""
                          : ` [${x.aliases.map((x) => x).join(", ")}]`
                      }\` - ${x.desc}`
                  ).join("\n")
                )
                .setThumbnail(
                  this.client.user.displayAvatarURL({ size: 2048 })
                );

              r.users.remove(r.users.cache.last());

              msg.edit(E2);
              break;
            }

            case Emojis.Three: {
              const E3 = new ClientEmbed(message.author)
                .addField(
                  `${Emojis.Economy} Comandos de Economia`,
                  Economy.map(
                    (x) =>
                      `\`${prefix}${x.name}${
                        !x.aliases.length
                          ? ""
                          : ` [${x.aliases.map((x) => x).join(", ")}]`
                      }\` - ${x.desc}`
                  ).join("\n")
                )
                .setThumbnail(
                  this.client.user.displayAvatarURL({ size: 2048 })
                );

              r.users.remove(r.users.cache.last());

              msg.edit(E3);
              break;
            }

            case Emojis.Four: {
              const E4 = new ClientEmbed(message.author)
                .addField(
                  `${Emojis.Robo} Comandos sem Categoria`,
                  Misc.map(
                    (x) =>
                      `\`${prefix}${x.name}${
                        !x.aliases.length
                          ? ""
                          : ` [${x.aliases.map((x) => x).join(", ")}]`
                      }\` - ${x.desc}`
                  ).join("\n")
                )
                .setThumbnail(
                  this.client.user.displayAvatarURL({ size: 2048 })
                );

              r.users.remove(r.users.cache.last());

              msg.edit(E4);
              break;
            }

            case Emojis.Five: {
              const E5 = new ClientEmbed(message.author)
                .addField(
                  `${Emojis.Owner} Comandos Restritos`,
                  Owner.map(
                    (x) =>
                      `\`${prefix}${x.name}${
                        !x.aliases.length
                          ? ""
                          : ` [${x.aliases.map((x) => x).join(", ")}]`
                      }\` - ${x.desc}`
                  ).join("\n")
                )
                .setThumbnail(
                  this.client.user.displayAvatarURL({ size: 2048 })
                );

              r.users.remove(r.users.cache.last());

              msg.edit(E5);
              break;
            }

            case Emojis.Back: {
              r.users.remove(r.users.cache.last());

              msg.edit(HELP);
              break;
            }

            case Emojis.Errado: {
              msg.delete();
            }
          }
        });
      });
    }
  }
};
