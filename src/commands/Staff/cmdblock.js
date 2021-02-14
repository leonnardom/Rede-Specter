const Command = require("../../structure/Command");
ClientEmbed = require("../../structure/ClientEmbed");
Emojis = require("../../utils/Emojis");

const Guild = require("../../database/Schemas/Guild");

module.exports = class CmdBlock extends Command {
  constructor(client) {
    super(client);
    this.client = client;

    this.name = "cmdblock";
    this.category = "Owner";
    this.description = "Bloquear comandos do Bot";
    this.aliases = ["cblock", "cmd-block", "cmd-b"];

    this.enabled = true;
    this.guildOnly = false;
  }
  async run(message, args, prefix) {
    if (!message.member.hasPermission("MANAGE_CHANNELS"))
      return message.channel.send(
        `${Emojis.Errado} - ${messaFge.author}, você precisa da permissão **MANAGE_CHANNELS** para executar este comando.`
      );

    Guild.findOne({ _id: message.guild.id }, async (err, server) => {
      if (!args[0])
        return message.channel.send(
          `${Emojis.Uso} - ${message.author}, use **${prefix}cmdblock help** para saber informações sobre o comando.`
        );

      const cmdblock = server.cmdblock;

      if (["status", "info", "help", "ajuda"].includes(args[0].toLowerCase())) {
        const EMBED = new ClientEmbed(message.author)

          .setAuthor(
            `${message.guild.name} - Bloqueador de Comandos`,
            message.guild.iconURL({ dynamic: true })
          )
          .addFields(
            {
              name: "Canais adicionados",
              value: !cmdblock.channels.length
                ? "Nenhu canal adicionado"
                : cmdblock.channels.map((x) => `<#${x}>`).join(", "),
            },
            {
              name: `Comandos liberados`,
              value: !cmdblock.enable.length
                ? "Nenhum comando liberado"
                : cmdblock.enable.map((x) => `**${x}**`).join(", "),
            },
            {
              name: `Status do Sistema`,
              value: `No momento o sistema se encontra **${
                cmdblock.status ? "ATIVADO" : "DESATIVADO"
              }**`,
            },
            {
              name: "Comandos",
              value: `${prefix}cmdblock add <canal> - Adiciona um canal à lista.\n${prefix}cmdblock remove <canal> - Remove um canal da lista.\n${prefix}cmdblock cmd <comando> - Adiciona/Remove um comando da lista\n${prefix}cmdblock on/off - Ativa/Desativa o sistema.`,
            }
          );
        message.channel.send(EMBED);
      }

      if (["add", "adicionar"].includes(args[0].toLowerCase())) {
        const channel =
          message.mentions.channels.first() ||
          message.guild.channels.cache.find((x) => x.id === args[1]) ||
          message.channel;

        if (cmdblock.channels.find((x) => x === channel.id)) {
          return message.channel.send(
            `${Emojis.Errado} - ${message.author}, o canal já se encontra adicionado ao sistema.`
          );
        } else {
          message.channel.send(
            `${Emojis.Certo} - ${message.author}, adicionei o canal ${channel} a lista de canais bloqueados com sucesso.`
          );

          await Guild.findOneAndUpdate(
            { _id: message.guild.id },
            { $push: { "cmdblock.channels": channel.id } }
          );
        }
      }

      if (["remove", "remover"].includes(args[0].toLowerCase())) {
        const channel =
          message.mentions.channels.first() ||
          message.guild.channels.cache.find((x) => x.id === args[1]) ||
          message.channel;

        if (!cmdblock.channels.find((x) => x === channel.id)) {
          return message.channel.send(
            `${Emojis.Errado} - ${message.author}, este canal não está adicionado à lista.`
          );
        } else {
          message.channel.send(
            `${Emojis.Certo} - ${message.author}, removi o canal ${channel} da lista de canais bloqueados com sucesso.`
          );

          await Guild.findOneAndUpdate(
            { _id: message.guild.id },
            { $pull: { "cmdblock.channels": channel.id } }
          );
        }
      }

      if (["off", "desligar", "desativar"].includes(args[0].toLowerCase())) {
        if (!cmdblock.status) {
          return message.channel.send(
            `${Emojis.Errado} - ${message.author}, o sistema já se encontra desligado.`
          );
        } else {
          message.channel.send(
            `${Emojis.Certo} - ${message.author}, o sistema foi desligado com sucesso.`
          );

          await Guild.findOneAndUpdate(
            { _id: message.guild.id },
            { $set: { "cmdblock.status": false } }
          );
        }
      }

      if (["on", "ligar", "ativar"].includes(args[0].toLowerCase())) {
        if (cmdblock.status) {
          return message.channel.send(
            `${Emojis.Errado} - ${message.author}, o sistema já se encontra ligado.`
          );
        } else {
          message.channel.send(
            `${Emojis.Certo} - ${message.author}, o sistema foi ligado com sucesso.`
          );

          await Guild.findOneAndUpdate(
            { _id: message.guild.id },
            { $set: { "cmdblock.status": true } }
          );
        }
      }

      if (["cmd", "comando"].includes(args[0].toLowerCase())) {
        let cmds =
          this.client.commands.get(args[1]) ||
          this.client.commands.find(
            (a) => a && a.aliases && a.aliases.includes(args[1])
          );

        let cmd = await cmds.name;

        if (cmdblock.enable.find((x) => x === cmd)) {
          return message.channel
            .send(
              `${Emojis.Certo} - ${message.author}, o comando já se encontrava na lista de comandos liberados, portanto eu o removi.`
            )
            .then(async (x) => {
              await Guild.findOneAndUpdate(
                { _id: message.guild.id },
                { $pull: { "cmdblock.enable": cmd } }
              );
            });
        } else {
          message.channel.send(
            `${Emojis.Certo} - ${message.author}, comando **\`${cmd}\`** adicionado à lista com sucesso.`
          );
          await Guild.findOneAndUpdate(
            { _id: message.guild.id },
            { $push: { "cmdblock.enable": cmd } }
          );
        }
      }
    });
  }
};
