const Command = require("../../structure/Command");
DiscordEmbed = require("../../structure/ClientEmbed");
const User = require("../../database/Schemas/User");

module.exports = class Test extends (
  Command
) {
  constructor(client) {
    super(client);
    this.client = client;

    this.name = "test";
    this.category = "Owner";
    this.description = "Eval do Bot";
    this.aliases = [];

    this.enabled = true;
    this.guildOnly = false;
  }
  async run(message, args) {
    if (message.author.id !== "600804786492932101") return;

    User.findOne({_id: message.author.id}, async (err, user) => {
        message.channel.send(Object.keys(user.work.works))
    })
  }
};
