const Command = require("../../structure/Command");
ClientEmbed = require("../../structure/ClientEmbed");
const Emojis = require("../../utils/Emojis");
const fetch = require("node-fetch");

module.exports = class Coins extends (
  Command
) {
  constructor(client) {
    super(client);
    this.client = client;

    this.name = "hug";
    this.category = "Misc";
    this.description =
      "Abrace alguém e mostre o carinho que você tem por ele(a) ^^";
    this.usage = "hug <user>";
    this.aliases = ["abraçar", "abraço"];

    this.enabled = true;
    this.guildOnly = false;
  }
  async run(message, args, prefix, utils) {
    const USER =
      message.mentions.users.first() || this.client.users.cache.get(args[0]);
    if (!USER) {
      return message.channel.send(
        `${Emojis.Errado} - ${message.author}, você deve mencionar/inserir o ID de quem deseja dar um abraço.`
      );
    } else if (USER.id == message.author.id)
      return message.channel.send(
        `${Emojis.Errado} - ${message.author}, vá abraçar outra pessoa seu carente. ^^`
      );

    const body = await fetch("https://nekos.life/api/v2/img/hug").then((res) =>
      res.json()
    );

    const EMBED = new ClientEmbed(message.author)
      .setDescription(`${message.author} deu um abraço no(a) ${USER}`)
      .setImage(body.url);

    message.channel.send(EMBED);
  }
};
