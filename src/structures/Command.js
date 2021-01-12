module.exports = class Command {
  constructor(client) {
    this.client = client;

    this.name = "CommandName";
    this.category = "Category";
    this.description = "Sem Descrição";
    this.aliases = [];

    this.enabled = true;
    this.guildOnly = false;
  }
  async run() {}
};
