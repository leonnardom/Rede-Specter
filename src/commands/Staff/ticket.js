const Command = require("../../structure/Command");
ClientEmbed = require("../../structure/ClientEmbed");
Emojis = require("../../utils/Emojis");

module.exports = class Ticket extends (
  Command
) {
  constructor(client) {
    super(client);
    this.client = client;

    this.name = "ticket";
    this.category = "Owner";
    this.description = "Envia a mensagem de ticket";
    this.aliases = [];

    this.enabled = true;
    this.guildOnly = false;
  }
  async run(message, args, prefix) {
    if (!args[0]) {
      const embeds = new ClientEmbed(message.author)

        .setDescription("`Carregando sistema de tickets, em andamento!`")
        .setTimestamp();

      message.channel.send(embeds);

      setTimeout(() => {
        const embed = new ClientEmbed(message.author)

          .setDescription(
            "`Sistema de tickets carregado, envio de mensagem em andamento!`"
          )
          .setTimestamp();

        message.channel.send(embed);

        setTimeout(() => {
          const embed = new ClientEmbed(message.author)

            .setTitle("Rede Specter - Ticket")
            .setDescription(
              `󠂪󠂪 󠂪󠂪 󠂪󠂪󠂪 󠂪󠂪 󠂪󠂪
    > Clique no emoji abaixo para ser redirecionado a criação de seu ticket.
    󠂪󠂪 󠂪󠂪 󠂪󠂪󠂪 󠂪󠂪 󠂪󠂪`
            )
            .setTimestamp();

          this.client.channels.cache
            .get(process.env.CHANNEL_ID)
            .send(embed)
            .then(function (message) {
              message.react("✅");
            });

          const embede = new ClientEmbed(message.author)

            .setDescription("`Mensagem enviada com sucesso!`")
            .setTimestamp();

          message.channel.send(embede);
        }, 5000);
      }, 6000);
      return;
    }

    if (["fechar", "close"].includes(args[0].toLowerCase())) {
      if (this.client.tickets.includes(message.channel.id)) {
        CloseTicket(message);
      }
    }
  }
};

async function AwaitReact(message, author, time, validReactions) {
  time *= 1000;
  for (const reaction of validReactions) await message.react(reaction);
  const filter = (reaction, user) =>
    validReactions.includes(reaction.emoji.name) && user.id === author.id;
  return message
    .awaitReactions(filter, { max: 1, time: time })
    .then((collected) => collected.first() && collected.first().emoji.name);
}

async function CloseTicket(message) {
  const chooseArr = ["✅", "❎"];

  const embed = new ClientEmbed(message.author)

    .setDescription("`Você quer fechar o ticket ?`")
    .setTimestamp();

  const m = await message.channel.send(embed);
  const reacted = await AwaitReact(m, message.author, 10, chooseArr);
  const result = await getResult(reacted);

  message.channel.send(result);
  m.reactions.removeAll();

  function getResult(me) {
    if (me === "❎") {
      const embed = new ClientEmbed(message.author)

        .setDescription("`Ação cancelada`")
        .setTimestamp();

      return embed;
    } else if (me === "✅") {
      const embed = new ClientEmbed(message.author)

        .setDescription("`O ticket fechará em 5 segundos`")
        .setTimestamp();

      message.channel.setName("ticket-fechado");

      setTimeout(() => {
        message.channel.delete();
      }, 5000);
      return embed;
    }
  }
}
