const Command = require("../../structure/Command");
ClientEmbed = require("../../structure/ClientEmbed");
const Emojis = require("../../utils/Emojis");
const Util = require("../../utils/Util");
const User = require("../../database/Schemas/User");
const moment = require("moment");
require("moment-duration-format");

module.exports = class Work extends (
  Command
) {
  constructor(client) {
    super(client);
    this.client = client;

    this.name = "work";
    this.category = "Economy";
    this.description = "Trabalhe para ganhar dinheiro";
    this.usage = "work"
    this.aliases = ["trabalhar"];

    this.enabled = true;
    this.guildOnly = false;
  }
  async run(message, args, prefix) {

    User.findOne({ _id: USER.id }, async (err, user) => {
      User.findOne({ _id: message.author.id }, async (err, author) => {

      })
    })
  }
};
