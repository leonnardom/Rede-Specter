const Command = require("../../structures/Command");
(ClientEmbed = require("../../structures/ClientEmbed")),
  (Emojis = require("../../utils/Emojis"));

module.exports = class EvalCommand extends (
  Command
) {
  constructor(client, config) {
    super(client);
    this.client = client;

    this.name = "eval";
    this.category = "Developer";
    this.description = "Eval do Bot";
    this.aliases = ["e"];

    this.enabled = true;
    this.guildOnly = false;
  }
  async run(message, args) {
    if (!message.author.id == process.env.OWNER_ID) return;
    try {
      let argumentos = args.join(" ");
      if (!argumentos) return;
      let code = eval(argumentos);

      if (typeof code !== "string")
        code = require("util").inspect(code, { depth: 0 });
      let EVAL = new ClientEmbed(message.author)
        .addField("Entrada", `\`\`\`js\n${argumentos}\`\`\``)
        .addField("Saída", `\`\`\`js\n${code}\n\`\`\``);
      message.channel.send(EVAL);
    } catch (e) {
      message.channel.send(`\`\`\`js\n${e}\n\`\`\``);
    }
  }
};
