module.exports = class Command {
  constructor(client) {
    this.client = client;

    this.name = "Nome";
    this.category = "Categoria";
    this.description = "Sem Descrição";
    this.usage = "Sem Informação";
    this.aliases = [];

    this.enabled = true;
    this.guildOnly = false;
  }

  async run() {}
};
