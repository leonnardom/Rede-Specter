const { Command, Emojis, ClientEmbed, ErrorCommand } = require("../../");

class SetRole extends Command {
  constructor(client) {
    super(client, {
      name: "set",
      description: "Seta um cargo ao usuário inserido",
      usage: {
        args: true,
        argsNeed: true,
        argsTxt: "<parameter> <user>",
        need: "{prefix} {cmd} {args}",
      },
      category: "Developer",
      cooldown: 3000,
      aliases: ["setar"],
      Permissions: [],
      UserPermissions: [],
      ownerNeed: true,
      needGuild: true,
    });
  }

  async run({ message, channel, author, guild, args }, t) {
    const EMBED = new ClientEmbed(author);
    const USER = await this.GetUser(args.slice(1), message, guild, author);
    const USER_DB = await this.client.database.users.get(USER.id);
    const cargos = [
      { cargo: "designer", id: "691073350994493481" },
      { cargo: "translate", id: "691073300494811187" },
      { cargo: "coordenador", id: "691073398402449408" },
      { cargo: "suporte", id: "691073085939515412" },
      { cargo: "gerente", id: "691073470129504257" },
      { cargo: "blacklist", id: "736780446377050124" },
    ];
    const servidor = this.client.guilds.cache.get("601848654202011677");
    const pesq = servidor.members.cache.find((x) => x.id === USER.id);
    const doc = await this.client.database.guilds.findOne({
      _id: message.guild.id,
    });

    if (args[0] && args[1] && USER_DB && USER_DB._id !== author.id) {
      const ALIASE = await this.GET_ALIASE(args[0]);
      if (ALIASE) {
        let SET =
          USER_DB.contributor[ALIASE.type] !== undefined
            ? USER_DB.contributor[ALIASE.type]
            : USER_DB[ALIASE.type];
        SET = SET ? false : true;

        let SEND = ALIASE.danger
          ? `comandos:set.${SET ? "banTo" : "unBanTo"}`
          : `comandos:set.${SET ? "setTo" : "unSetTo"}`;

        await this.client.DatabaseUtils[
          "set" + ALIASE.type.charAt(0).toUpperCase() + ALIASE.type.slice(1)
        ](USER, SET).catch((err) => {
          throw new ErrorCommand(err);
        });

        return channel
          .send(
            EMBED.setDescription(
              `${Emojis.Certo} **${author.username}**, ${t(`${SEND}`, {
                user: USER.username,
                type: ALIASE.type,
              })}`
            )
          )
         
      } else {
        return channel.send(
          EMBED.setDescription(
            `${Emojis.Errado} **${author.username}**, ${t(
              "comandos:set.noAliaseContent",
              {
                parameters: await this.GET_PARAMETERS(),
              }
            )}`
          ).setColor(process.env.ERROR_COLOR)
        );
      }
    } else {
      const ERROR = !args[0]
        ? "comandos:set.noParameters"
        : !(await this.GET_ALIASE(args[0]))
        ? "comandos:set.noAliaseContent"
        : !args[1]
        ? "comandos:set.noUserIdentify"
        : !USER_DB
        ? "comandos:set.noUserDb"
        : USER.id === author.id
        ? "comandos:set.noUserIdentify"
        : "comandos:set.noParameters";

      return channel.send(
        EMBED.setDescription(
          `${Emojis.Errado} **${author.username}**, ${t(ERROR, {
            user: USER.username,
            parameters: await this.GET_PARAMETERS(),
          })}`
        ).setColor(process.env.ERROR_COLOR)
      );
    }
  }

  GET_PARAMETERS() {
    return (
      "[" +
      this.client.Aliases["set"]
        .map((parameter) => `${parameter.aliase.map((a) => a).slice(0, 1)}`)
        .join(" | ") +
      "]"
    );
  }

  async GET_ALIASE(msg) {
    return await this.client.Aliases["set"].find((get) =>
      get.aliase.includes(msg.toLowerCase())
    );
  }
}

module.exports = SetRole;
