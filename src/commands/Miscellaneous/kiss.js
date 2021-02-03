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

    this.name = "kiss";
    this.category = "Misc";
    this.description =
      "De um beijo em alguém e mostre o carinho que você tem por ele(a) ^^";
    this.usage = "kiss <user>";
    this.aliases = ["beijar", "beijo"];

    this.enabled = true;
    this.guildOnly = false;
  }
  async run(message, args, prefix, utils) {
    const USER =
      message.mentions.users.first() || this.client.users.cache.get(args[0]);

    if (!USER) {
      return message.channel.send(
        `${Emojis.Errado} - ${message.author}, você deve mencionar/inserir o ID de quem deseja dar um beijo.`
      );
    } else if (USER.id == message.author.id)
      return message.channel.send(
        `${Emojis.Errado} - ${message.author}, vá beijar outra pessoa seu carente. ^^`
      );

    const body = await fetch("https://nekos.life/api/v2/img/kiss").then((res) =>
      res.json()
    );

    const EMBED = new ClientEmbed(message.author)
      .setDescription(`${message.author} deu um beijo no(a) ${USER}`)
      .setImage(body.url);

    message.channel.send(EMBED);
  }
};
