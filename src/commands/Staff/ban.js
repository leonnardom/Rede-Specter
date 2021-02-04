const Command = require("../../structure/Command");
ClientEmbed = require("../../structure/ClientEmbed");
Emojis = require("../../utils/Emojis");

const Guild = require("../../database/Schemas/Guild");

module.exports = class Ban extends (
  Command
) {
  constructor(client) {
    super(client);
    this.client = client;

    this.name = "ban";
    this.category = "Owner";
    this.description = "Banir usuários do seu servidor";
    this.aliases = ["banir"];

    this.enabled = true;
    this.guildOnly = false;
  }
  async run(message, args, prefix) {
    if (!message.member.hasPermission("BAN_MEMBERS"))
      return message.channel.send(
        `${Emojis.Errado} - ${message.author}, você não tem permissão de executar este comando.`
      );

    var membro =
      message.mentions.members.first() ||
      message.guild.members.cache.get(args[0]);
    if (!membro)
      return message.channel.send(
        `${Emojis.Errado} - ${message.author}, formato correto de executar o comando: **\`${prefix}ban <membro> <motivo>\`**.`
      );
    if (membro === message.member)
      return message.channel.send(
        `${Emojis.Errado} - ${message.author}, você não pode se banir.`
      );

    var motivo = !args[1] ? "Não informado" : args.slice(1).join(" ");

    const ban = new ClientEmbed(message.author).setDescription(
      `${Emojis.Certo} - ${message.author}, você dejesa banir o usuário: **${membro.user.username}** ?`
    );

    message.channel.send(ban).then((msg) => {
      msg.react("✅");

      let filtro = (reaction, usuario) =>
        reaction.emoji.name === "✅" && usuario.id === message.author.id;
      let coletor = msg.createReactionCollector(filtro, { max: 1 });

      ban.setAuthor(
        `Punição`,
        membro.user.displayAvatarURL({ dynamic: true, size: 4096 })
      );
      ban.setDescription(`${membro} foi banido!`);
      ban.addField("Motivo", motivo);
      ban.addField("Duração", "Permanentemente", true);
      ban.addField("Aplicado por", message.author, true);

      coletor.on("collect", (cp) => {
        cp.remove(message.author.id);
        message.channel.bulkDelete(2);
        this.client.channels.cache.get(process.env.LOGS).send(ban);
        membro.ban();
      });
    });
  }
};
