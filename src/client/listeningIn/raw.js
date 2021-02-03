module.exports = class {
  constructor(client) {
    this.client = client;
  }

  async run(dados) {
    if (dados.t !== "MESSAGE_REACTION_ADD") return;
    if (dados.d.message_id != process.env.MSGID) return;

    let servidor = this.client.guilds.cache.get(process.env.GUILD_ID);
    let membro = servidor.members.cache.get(dados.d.user_id);

    let cargo = servidor.roles.cache.get(process.env.ROLE_ID);

    if (dados.t === "MESSAGE_REACTION_ADD") {
      if (dados.d.emoji.name === "✅") {
        if (membro.roles.cache.has(cargo)) return;
        membro.roles.add(cargo);

        servidor.channels.cache
          .get(process.env.CAPTCHA)
          .messages.fetch(dados.d.message_id)
          .then((message) => {
            message.reactions.cache
              .find((r) => r.emoji.name === "✅")
              .users.remove(dados.d.user_id);
          });
      }
    }
  }
};
