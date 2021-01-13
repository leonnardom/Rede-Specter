const Command = require("../../structure/Command");
ClientEmbed = require("../../structure/ClientEmbed");
Emojis = require("../../utils/Emojis");

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
      const HELP = new ClientEmbed(message.author)
        .setAuthor(
          `Central de Ajuda do Bot`,
          this.client.user.displayAvatarURL({ size: 2048 })
        )
        .setDescription(
          `${Emojis.User} - **${message.author.tag}**, aqui você irá encontrar todos os meus comandos, para saber mais sobre algum comando use **\`${prefix}help <comando>\`**\nNo momento tenho **${this.client.commands.size} comandos**.`
        )
        .setThumbnail(this.client.user.displayAvatarURL({ size: 2048 }));

      commands.map((cmd) => {
        if (cmd.category === "Bot") Bot.push(cmd.name);
        else if (cmd.category == "Owner") Owner.push(cmd.name);
        else if (cmd.category == "Information") Information.push(cmd.name);
        else Bot.push(cmd.name);

      });

      HELP.addFields(
        {
          name: `${Emojis.Robo} Bot`,
          value: Bot.map((x) => `\`${x}\``).join(", "),
        },
        {
          name: `${Emojis.Information} Informação`,
          value: Information.map((x) => `\`${x}\``).join(", "),
        },
        {
          name: `${Emojis.Owner} Owner`,
          value: Owner.map((x) => `\`${x}\``).join(", "),
        }
      );

      message.channel.send(message.author, HELP);
    }
  }
};
