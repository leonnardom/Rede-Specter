const Command = require("../../structure/Command");
const Emojis = require("../../utils/Emojis");
const Util = require("../../utils/Util");
const User = require("../../database/Schemas/User");
const ClientEmbed = require("../../structure/ClientEmbed");
const moment = require("moment");
require("moment-duration-format");
const { MessageAttachment } = require("discord.js");

const { loadImage, registerFont, createCanvas } = require("canvas");
registerFont("src/assets/fonts/Calibri.ttf", { family: "Calibri" });
registerFont("src/assets/fonts/Montserrat-Black.ttf", {
  family: "Monstserrat",
});

module.exports = class Work extends (
  Command
) {
  constructor(client) {
    super(client);
    this.client = client;

    this.name = "work";
    this.category = "Economy";
    this.description = "Trabalhe para ganhar dinheiro";
    this.usage = "work";
    this.aliases = ["trabalhar"];

    this.enabled = true;
    this.guildOnly = false;
  }
  async run(message, args, prefix, utils) {
    const cooldown = 4.32e7;
    if (!args[0]) {
      User.findOne({ _id: message.author.id }, async (err, author) => {
        const work = author.work;
        const works = work.cooldown;
        let time = cooldown - (Date.now() - works);

        if (!work.register) {
          return message.channel.send(
            `${Emojis.Errado} - ${message.author}, você ainda não está registrado na empresa, use **${prefix}work registrar** para se registrar e começar a trabalhar.`
          );
        } else {
          if (works !== null && cooldown - (Date.now() - works) > 0) {
            return message.channel.send(
              `${Emojis.Errado} - ${
                message.author
              }, você deve aguardar **${moment
                .duration(time)
                .format("h [horas], m [minutos] e s [segundos]")
                .replace("minsutos", "minutos")}** para trabalhar novamente`
            );
          } else {
            const today = Object.values(work.works).filter(
              (x, z) => !!x.active
            );

            const cName = today.map((x) => x.name);
            const atual = today.map((x) => x.coins);
            let xp = Math.round(Math.random() * 50) + 1;

            await User.findOneAndUpdate(
              { _id: message.author.id },
              {
                $set: {
                  "work.cooldown": Date.now(),
                  coins: author.coins + parseInt(atual),
                  "work.exp": work.exp + xp,
                  "work.total": author.work.total + parseInt(atual),
                },
              }
            ).then(async (x) => {
              if (x.work.exp > x.work.nextLevel * x.work.level) {
                switch (x.work.level + 1) {
                  case 10:
                    message.channel.send(
                      `${Emojis.Certo} - ${message.author}, você upou de nível e agora trabalha como: **Empacotador**. ^^`
                    );
                    await User.findOneAndUpdate(
                      { _id: message.author.id },
                      {
                        $set: {
                          "work.level": work.level + 1,
                          "work.exp": 0,
                          "work.works.Lixeiro.active": false,
                          "work.works.Empacotador.active": true,
                        },
                      }
                    );
                    break;
                }
                switch (x.work.level + 1) {
                  case 20:
                    message.channel.send(
                      `${Emojis.Certo} - ${message.author}, você upou de nível e agora trabalha como: **iFood**. ^^`
                    );
                    await User.findOneAndUpdate(
                      { _id: message.author.id },
                      {
                        $set: {
                          "work.level": work.level + 1,
                          "work.exp": 0,
                          "work.works.Empacotador.active": false,
                          "work.works.iFood.active": true,
                        },
                      }
                    );
                    break;
                }
                switch (x.work.level + 1) {
                  case 30:
                    message.channel.send(
                      `${Emojis.Certo} - ${message.author}, você upou de nível e agora trabalha como: **Administração**. ^^`
                    );
                    await User.findOneAndUpdate(
                      { _id: message.author.id },
                      {
                        $set: {
                          "work.level": work.level + 1,
                          "work.exp": 0,
                          "work.works.iFood.active": false,
                          "work.works.Administracao.active": true,
                        },
                      }
                    );
                    break;
                }
                switch (x.work.level + 1) {
                  case 40:
                    message.channel.send(
                      `${Emojis.Certo} - ${message.author}, você upou de nível e agora trabalha como: **Policial**. ^^`
                    );
                    await User.findOneAndUpdate(
                      { _id: message.author.id },
                      {
                        $set: {
                          "work.level": work.level + 1,
                          "work.exp": 0,
                          "work.works.Administracao.active": false,
                          "work.works.Policial.active": true,
                        },
                      }
                    );
                    break;
                }
                switch (x.work.level + 1) {
                  case 50:
                    message.channel.send(
                      `${Emojis.Certo} - ${message.author}, você upou de nível e agora trabalha como: **Advogado**. ^^`
                    );
                    await User.findOneAndUpdate(
                      { _id: message.author.id },
                      {
                        $set: {
                          "work.level": work.level + 1,
                          "work.exp": 0,
                          "work.works.Policial.active": false,
                          "work.works.Advogado.active": true,
                        },
                      }
                    );
                    break;
                }
                switch (x.work.level + 1) {
                  case 60:
                    message.channel.send(
                      `${Emojis.Certo} - ${message.author}, você upou de nível e agora trabalha como: **Engenheiro**. ^^`
                    );
                    await User.findOneAndUpdate(
                      { _id: message.author.id },
                      {
                        $set: {
                          "work.level": work.level + 1,
                          "work.exp": 0,
                          "work.works.Advogado.active": false,
                          "work.works.Engenheiro.active": true,
                        },
                      }
                    );
                    break;
                }
                switch (x.work.level + 1) {
                  case 70:
                    message.channel.send(
                      `${Emojis.Certo} - ${message.author}, você upou de nível e agora trabalha como: **Progamador**. ^^`
                    );
                    await User.findOneAndUpdate(
                      { _id: message.author.id },
                      {
                        $set: {
                          "work.level": work.level + 1,
                          "work.exp": 0,
                          "work.works.Engenheiro.active": false,
                          "work.works.Progamador.active": true,
                        },
                      }
                    );
                    break;
                }
                switch (x.work.level + 1) {
                  case 80:
                    message.channel.send(
                      `${Emojis.Certo} - ${message.author}, você upou de nível e agora trabalha como: **Medico**. ^^`
                    );
                    await User.findOneAndUpdate(
                      { _id: message.author.id },
                      {
                        $set: {
                          "work.level": work.level + 1,
                          "work.exp": 0,
                          "work.works.Progamador.active": false,
                          "work.works.Medico.active": true,
                        },
                      }
                    );
                    break;
                }
                return message.channel.send(
                  `${Emojis.Certo} - ${
                    message.author
                  }, você acaba de subir para o level **${work.level + 1}**. ^^`
                );
              } else {
                return message.channel.send(
                  `${Emojis.Certo} - ${message.author}, você trabalhou como **${cName}** com sucesso e recebeu **R$${atual}**`
                );
              }
            });
          }
        }
      });
      return;
    }

    if (["name", "nome"].includes(args[0].toLowerCase())) {
      User.findOne({ _id: message.author.id }, async (err, author) => {
        let name = args.slice(1).join(" ");
        if (
          message.content.includes("*") ||
          message.content.includes("_") ||
          message.content.includes("`")
        ) {
          return message.channel.send(
            `${Emojis.Errado} - ${message.author}, não é possível usar os seguintes símbolos no nome da empresa:\`* - _ e ASPAS\``
          );
        }

        if (!name) {
          return message.channel.send(
            `${Emojis.Errado} - ${message.author}, você não digitou nenhum nome para eu setar no nome da sua empresa.`
          );
        } else if (name.length > 20) {
          return message.channel.send(
            `${Emojis.Errado} - ${message.author}, o nome inserido é muito grande, insira um com até **20 caracteres**.`
          );
        } else {
          message.channel.send(
            `${Emojis.Certo} - ${message.author}, nome da sua fazenda alterado para **\`${name}\`** com sucesso.`
          );
          await User.findOneAndUpdate(
            { _id: message.author.id },
            {
              $set: {
                "work.name": name,
              },
            }
          );
        }
      });
      return;
    }

    if (["registrar", "register"].includes(args[0].toLowerCase())) {
      if (work.register) {
        return message.channel.send(
          `${Emojis.Errado} - ${message.author}, você já está registrado, portanto não é possível registrar novamente.`
        );
      } else {
        message.channel.send(
          `${Emojis.Certo} - ${message.author}, parabéns por se registrar na empresa, hoje começa seus dias de sofrência, você está começando como **Lixeiro** no Level **1** com o salário de **R$${worke.works.Lixeiro.coins}**, com o tempo irá upar e receber mais dinheiro em empregos melhores.`
        );
        await User.findOneAndUpdate(
          { _id: message.author.id },
          {
            $set: {
              "work.register": true,
              "work.works.Lixeiro.active": true,
            },
          }
        );
      }
    }

    const users =
      this.client.users.cache.get(args[1]) ||
      message.mentions.users.first() ||
      message.author;

    User.findOne({ _id: users.id }, async (err, user) => {
      const worke = user.work;
      const workes = worke.cooldown;
      let time = cooldown - (Date.now() - workes);

      if (["empregos"].includes(args[0].toLowerCase())) {
        const today = Object.values(worke.works).filter((x) => !!x.active);

        const INFO = new ClientEmbed(message.author).setAuthor(
          `Lista de Empregos`,
          this.client.user.displayAvatarURL()
        ).setDescription(`Informações sobre: **${
          users.tag
        }**\n\n${Object.values(worke.works)
          .map(
            (key) =>
              `Emprego: **${key.name}** | Level: **${
                key.level <= user.work.level
                  ? `${key.level} ${Emojis.Certo}`
                  : key.level
              }**\nSalário: **R$ ${Util.toAbbrev(key.coins)}**`
          )
          .slice(1, 10)
          .join("\n\n")}\n\n
          ${
            !today.length
              ? `> Não possui emprego ainda, use **${prefix}work registrar** para se registrar na empresa`
              : `> Level **${worke.level} ( XP: ${worke.exp}/${
                  worke.level * worke.nextLevel
                } )** e está trabalhando como **${today.map(
                  (x) => x.name
                )}**.\n> Já recebeu um total de **R$${Util.toAbbrev(
                  worke.total
                )}**.\n${
                  workes !== null && cooldown - (Date.now() - workes) > 0
                    ? `> Aguarde **${moment
                        .duration(time)
                        .format("h [horas], m [minutos] e s [segundos]")
                        .replace(
                          "minsutos",
                          "minutos"
                        )}** até poder trabalhar novamente.`
                    : "> Já pode trabalhar novamente."
                }`
          }`);

        message.channel.send(INFO);
        return;
      }

      if (["info"].includes(args[0].toLowerCase())) {
        const today = Object.values(worke.works).filter((x) => !!x.active);

        const canvas = createCanvas(400, 500);
        const ctx = canvas.getContext("2d");

        const background = await loadImage("./src/assets/img/Work_Info.png");
        ctx.drawImage(background, 0, 0, 400, 500);

        ctx.textAlign = "center";
        ctx.font = "50px 'Montserrat'";
        ctx.fillStyle = "#fbfbfb";
        await utils.renderEmoji(
          ctx,
          users.username.length > 15
            ? users.username.slice(0, 15) + "..."
            : users.username,
          200,
          200
        );

        ctx.textAlign = "right";
        ctx.font = "28px 'Montserrat'";
        ctx.fillStyle = "#070000";
        await utils.renderEmoji(
          ctx,
          user.work.name.length > 15
            ? user.work.name.slice(0, 15) + "..."
            : user.work.name,
          395,
          250
        );
        ctx.fillText(
          today.map((x) => x.name),
          395,
          285
        );
        ctx.fillText("R$" + Util.toAbbrev(today.map((x) => x.coins)), 395, 320);
        ctx.fillText(user.work.level, 395, 355);

        //========================// Import ProgressBar //========================//

        const need = user.work.level * user.work.nextLevel;

        let widthXp = (user.work.exp * 335) / need;
        if (user.work.exp > 335 - 18.5) user.work.xp = 200 - 18.5;

        ctx.beginPath();
        ctx.fillStyle = "#404040";
        ctx.arc(
          15 + 18.5,
          360 + 18.5 + 36.25,
          18.5,
          1.5 * Math.PI,
          0.5 * Math.PI,
          true
        );
        ctx.fill();
        ctx.fillRect(15 + 18.5, 360 + 36.25, 350 - 18.5, 37.5);
        ctx.arc(
          15 + 350,
          360 + 18.5 + 36.25,
          18.75,
          1.5 * Math.PI,
          0.5 * Math.PI,
          false
        );
        ctx.fill();

        ctx.beginPath();
        ctx.fillStyle = "#88e8ff";
        ctx.arc(
          15 + 18.5,
          360 + 18.5 + 36.25,
          18.5,
          1.5 * Math.PI,
          0.5 * Math.PI,
          true
        );
        ctx.fill();
        ctx.fillRect(15 + 18.5, 360 + 36.25, widthXp, 37.5);
        ctx.arc(
          15 + 18.5 + widthXp,
          360 + 18.5 + 36.25,
          18.75,
          1.5 * Math.PI,
          0.5 * Math.PI,
          false
        );
        ctx.fill();

        //========================// Import Info Xp Progress Bar //========================//

        ctx.textAlign = "center";
        ctx.font = "25px 'Calibri'";
        ctx.fillStyle = "#fbfbfb";
        ctx.fillText(
          `${Util.toAbbrev(user.work.exp)}/${Util.toAbbrev(
            user.work.level * user.work.nextLevel
          )}`,
          200,
          425
        );
        //========================// Import Avatar //========================//

        ctx.beginPath();
        ctx.arc(200, 70, 65, 0, Math.PI * 2, true);
        ctx.lineWidth = 6;
        ctx.strokeStyle = "#88e8ff";
        ctx.stroke();
        ctx.closePath();
        ctx.clip();

        const avatar = await loadImage(
          users.displayAvatarURL({ format: "jpeg" })
        );
        ctx.drawImage(avatar, 135, 5, 130, 130);

        const attach = new MessageAttachment(
          canvas.toBuffer(),
          `Work_Info(${users.tag})--.png`
        );

        message.channel.send(attach);
      }
    });
  }
};
