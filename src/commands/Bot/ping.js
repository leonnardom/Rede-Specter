const Command = require("../../structure/Command");
DiscordEmbed = require("../../structure/ClientEmbed");

module.exports = class Ping extends (
  Command
) {
  constructor(client) {
    super(client);
    this.client = client;

    this.name = "ping";
    this.category = "Bot";
    this.description = "Veja a Latência da API";
    this.usage = "ping";
    this.aliases = ["latency"];

    this.enabled = true;
    this.guildOnly = false;
  }
  async run(message) {
    let embed = new DiscordEmbed(message.author).setDescription("Ping!");
    message.channel.send(embed).then((msg) => {
      msg.edit(
        embed.setDescription(`Pong! ${Math.round(this.client.ws.ping) + "ms"}`)
      );
    });
  }
};
