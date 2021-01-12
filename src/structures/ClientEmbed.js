const Discord = require("discord.js");

module.exports = class ClientEmbed extends (
  Discord.MessageEmbed
) {
  constructor(user, data = {}) {
    super(data);
    this.setFooter(
      `Comando Executado por: ${user.tag}`,
      user.displayAvatarURL({ dynamic: true })
    );
    this.setColor("#00fff8");
  }
};
