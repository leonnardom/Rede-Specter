const SLEEP = async () => {
  return Number(30000);
};

module.exports = class {
  constructor(client) {
    this.client = client;
  }

  async run(client) {
    try {
      console.log(
        `(ONLINE) - Bot Online!\nUsuários: ${this.client.users.cache.size}\nServidores: ${this.client.guilds.cache.size}\nCanais: ${this.client.channels.cache.size}`
      );

      this.client.user.setActivity("🎮 na Rede Specter.", {
        type: "PLAYING",
        url: "https://forum.redespecter.com",
      });

      const timeOut = (ms) => setTimeout(UPDATE_CHANNEL, ms);
      const UPDATE_CHANNEL = async () => {
        console.log("(ONLINE): Continuo Online sem Problemas.");

        return timeOut(await SLEEP());
      };

      return timeOut();
    } catch (error) {
      console.log(error);
    }
  }
};
