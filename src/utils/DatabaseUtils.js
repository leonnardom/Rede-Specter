module.exports = class DatabaseUtils {
  constructor(client) {
    this.client = client;
  }

  async ClientMaintence(maintence) {
    return await this.client.database.clientUtils.update(this.client.user.id, {
      $set: { maintence },
    });
  }

  async CommandMaintence(command, maintence) {
    if (!command) throw new Error("unidentified command");
    return await this.client.database.comandos.update(command, {
      $set: { maintence },
    });
  }
};
