const Event = require("../../structures/Event.js");

const SLEEP = async () => {
  return Number((Math.random() * (60 - 30) + 500).toFixed(0) + "000");
};

module.exports = class ReadyEvent extends (
  Event
) {
  constructor(client) {
    super(client);

    this.client = client;
    this.name = "ready";
  }

  async ON() {
    console.log(`(ONLINE): Bot ligado com sucesso.\n\n`);

    this.client.user.setActivity("🎮 na Rede Specter.", {
      type: "PLAYING",
    });
  }
};
