const { MessageEmbed } = require("discord.js");

module.exports = class ClientEmbed extends (
  MessageEmbed
) {
  constructor(user, data = {}) {
    super(data);
    this.setColor(process.env.COLOR_EMBED);
    if (user)
      this.setFooter(
        `${user.tag}`,
        user.displayAvatarURL({ dynamic: true })
      ).setTimestamp();
  }
};
