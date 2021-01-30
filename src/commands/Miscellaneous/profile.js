const Command = require("../../structure/Command");
ClientEmbed = require("../../structure/ClientEmbed");
const Emojis = require("../../utils/Emojis");
// const Util = require("../../utils/Util");
const User = require("../../database/Schemas/User");
const moment = require("moment");
require("moment-duration-format");
const { MessageAttachment } = require("discord.js");

const { loadImage, registerFont, createCanvas } = require("canvas");
registerFont("src/assets/fonts/Calibri.ttf", { family: "Calibri" });
registerFont("src/assets/fonts/Montserrat-Black.ttf", {
  family: "Monstserrat",
});

module.exports = class Coins extends (
  Command
) {
  constructor(client) {
    super(client);
    this.client = client;

    this.name = "profile";
    this.category = "Misc";
    this.description = "Veja seu perfil";
    this.usage = "profile [user]";
    this.aliases = ["p", "perfil"];

    this.enabled = true;
    this.guildOnly = false;
  }
  async run(message, args, prefix, utils) {
    const USER =
      message.mentions.users.first() ||
      this.client.users.cache.get(args[0]) ||
      message.author;

    User.findOne({ _id: USER.id }, async (err, user) => {
      await require("mongoose")
        .connection.collection("users")
        .find({ bank: { $gt: 0 } })
        .toArray(async (err, res) => {
          if (err) throw err;

          let top_users = res.sort((x, f) => f.bank - x.bank);

          var top =
            [...top_users.values()].findIndex((x) => x._id === USER.id) + 1;

          if (!user)
            return message.channel
              .send(
                `${Emojis.Errado} - ${message.author}, o membro não estava registrado em minha **DataBase**, vou registra-lo.`
              )
              .then(async (x) => {
                User.create({ _id: USER.id });
              });

          const status = {
            online: Emojis.Online + "Online",
            idle: Emojis.Ausente + "Ausente",
            dnd: Emojis.Ocupado + "Ocupado",
            offline: Emojis.Offline + "Offline",
          };

          let flags;
          if (this.client.users.cache.get(USER.id).flags == null) flags = "";
          else
            flags = this.client.users.cache
              .get(USER.id)
              .flags.toArray()
              .join("")
              .replace("EARLY_VERIFIED_DEVELOPER", Emojis.Developer)
              .replace("HOUSE_BRILLIANCE", Emojis.Brilliance)
              .replace("VERIFIED_DEVELOPER", "")
              .replace("HOUSE_BRAVERY", Emojis.Bravery)
              .replace("HOUSE_BALANCE", Emojis.Balance)
              .replace("EARLY_SUPPORTER", Emojis.Early)
              .replace("VERIFIED_BOT", Emojis.BotVerificado);

          const canvas = createCanvas(800, 600);
          const ctx = canvas.getContext("2d");

          const background = await loadImage("./src/assets/img/Profile_1.jpg");

          ctx.drawImage(background, 0, 0, 800, 600);

          ctx.textAlign = "left";
          ctx.font = "30px 'Monstserrat'";
          ctx.fillStyle = "#ffffFf";
          await utils.renderEmoji(
            ctx,
            `${Emojis.Coins} ${utils.toAbbrev(user.coins)}`,
            10,
            40
          );
          await utils.renderEmoji(
            ctx,
            `${Emojis.Bank} ${utils.toAbbrev(user.bank)}`,
            10,
            90
          );
          await utils.renderEmoji(
            ctx,
            `${Emojis.Economy} ${utils.toAbbrev(user.bank + user.coins)}`,
            10,
            140
          );

          ctx.font = "30px 'Monstserrat'";

          await utils.renderEmoji(
            ctx,
            USER.username.length > 25
              ? USER.username.slice(0, 25) + "..."
              : USER.username,
            400,
            580
          );

          ctx.font = "25px 'Monstserrat'";

          await utils.renderEmoji(
            ctx,
            `${Emojis.Medal} Ranking Monetário: ${top}º`,
            430,
            530
          );
          await utils.renderEmoji(
            ctx,
            `${Emojis.Status} Status: ${status[USER.presence.status]}`,
            440,
            480
          );
          await utils.renderEmoji(
            ctx,
            `${Emojis.Date} C. Conta: ${moment(USER.createdAt).format("L")}`,
            450,
            430
          );
          await utils.renderEmoji(
            ctx,
            `${Emojis.Date} Entrada: ${moment(
              message.guild.member(USER.id).joinedAt
            ).format("L")}`,
            490,
            380
          );
          await utils.renderEmoji(ctx, `${flags}`, 520, 330);

          ctx.arc(115, 500, 85, 0, Math.PI * 2, true);
          ctx.lineWidth = 6;
          ctx.strokeStyle = "#88e8ff";
          ctx.stroke();
          ctx.closePath();
          ctx.clip();

          const avatar = await loadImage(
            USER.displayAvatarURL({ format: "jpeg" })
          );
          ctx.drawImage(avatar, 30, 415, 170, 170);

          const attach = new MessageAttachment(
            canvas.toBuffer(),
            `Specter_Profile--(${USER.tag})--.png`
          );

          message.channel.send(attach);
        });
    });
  }
};
