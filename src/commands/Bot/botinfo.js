const Command = require("../../structure/Command");
ClientEmbed = require("../../structure/ClientEmbed");
Emojis = require("../../utils/Emojis");

module.exports = class BotInfo extends (
  Command
) {
  constructor(client) {
    super(client);
    this.client = client;

    this.name = "botinfo";
    this.category = "Bot";
    this.description = "Veja às informações do Bot";
    this.usage = "botinfo";
    this.aliases = [];

    this.enabled = true;
    this.guildOnly = false;
  }
  async run(message, args, prefix) {
    const dev = await this.client.users.fetch("600804786492932101");

    const EMBED = new ClientEmbed(message.author)

      .setAuthor(`Minhas Informações`, this.client.user.displayAvatarURL())
      .addFields(
        {
          name: `${Emojis.Comando} Meu Desenvolvedor`,
          value: dev.tag,
        },
        {
          name: `${Emojis.Robo} Prefixo`,
          value: prefix,
        },
        {
          name: `${Emojis.Aliases} Servidores`,
          value: this.client.guilds.cache.size,
        },
        {
          name: `${Emojis.User} Usuários`,
          value: this.client.users.cache.size,
        },
        {
          name: `${Emojis.JavaScript} Linguagem de Desenvolvimento`,
          value: `**[JavaScript](https://discord.js.org/)**`,
        }
        // {
        //     name: `Sabia que sou Open Source?`,
        //     value: `**[Clique Aqui](https://github.com/zSpl1nterUS/Rede-Specter)**`
        // }
      )
      .setThumbnail(
        this.client.user.displayAvatarURL({ size: 2048, format: "jpg" })
      );

    message.channel.send(EMBED);
  }
};
