const ClientEmbed = require("../../structure/ClientEmbed");
const bdd = require("../../utils/bdd.json");

module.exports = class {
  constructor(client) {
    this.client = client;
  }

  async run(reaction, user) {
    const members = reaction.message.guild.members.cache.get(user.id);
    if (members.user.bot) return;
    if (reaction.message.channel.id === process.env.CHANNEL_ID) {
      if (reaction.emoji.name === "✅") {
        bdd.NumberTicket++;
        if (bdd.NumberTicket >= 10) {
          bdd.NumbersTicket = "00";
        } else if (bdd.NumberTicket >= 100) {
          bdd.NumbersTicket = "0";
        } else if (bdd.NumberTicket >= 1000) {
          bdd.NumberTicket = " ";
        }
        reaction.remove().then(function (message) {
          message.message.react("✅");
        });
        reaction.message.guild.channels
          .create("ticket-" + bdd.NumbersTicket + bdd.NumberTicket, {
            type: "text",
            permissionOverwrites: [
              {
                allow: "VIEW_CHANNEL",
                deny: "ADD_REACTIONS",
                id: user.id,
              },
              {
                deny: "VIEW_CHANNEL",
                id: reaction.message.guild.id,
              },
              {
                allow: "VIEW_CHANNEL",
                deny: "ADD_REACTIONS",
                id: process.env.STAFF_ROLE,
              },
            ],
          })
          .then((msg) => {
            const embed = new ClientEmbed(this.client.user)
              .setDescription("Bem vindo ao ticket de suporte.")
              .setFooter("Rede Specter", this.client.user.avatarURL())
              .setTimestamp();
            msg.send("Olá " + user.toString() + ".");
            msg.send(embed).then(function (message) {
              message.react("🔒");
            });
            this.client.tickets.push(msg.id);
          });
      }
    }
    if (this.client.tickets.includes(reaction.message.channel.id)) {
      if (reaction.emoji.name === "🔒") {
        reaction.message.react("✅");
        const chooseArr = ["✅", "❎"];
        const reacted = await AwaitReact(reaction.message, user, 10, chooseArr);
        const result = await getResult(reacted);
        if (reacted == "✅") {
          reaction.message.channel.send(result);
        }
        function getResult(me) {
          if (me === "✅") {
            const embed = new ClientEmbed(this.client.user)
              .setDescription("`O ticket fechará em 5 segundos`")
              .setTimestamp();
            reaction.message.reactions.removeAll();
            reaction.message.channel.setName("ticket-fechado");
            setTimeout(() => {
              reaction.message.channel.delete();
            }, 5000);
            return embed;
          } else if (me === "❎") {
            reaction.message.reactions.removeAll();
            reaction.message.react("🔒");
          }
        }
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
