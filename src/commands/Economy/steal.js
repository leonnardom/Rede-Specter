const Command = require("../../structure/Command");
ClientEmbed = require("../../structure/ClientEmbed");
const Emojis = require("../../utils/Emojis");
const Util = require("../../utils/Util");
const User = require("../../database/Schemas/User");
const moment = require("moment");
require("moment-duration-format");

module.exports = class Steal extends (
  Command
) {
  constructor(client) {
    super(client);
    this.client = client;

    this.name = "steal";
    this.category = "Economy";
    this.description = "Roube alguém";
    this.usage = "steal <user>"
    this.aliases = ["roubar", "rob"];

    this.enabled = true;
    this.guildOnly = false;
  }
  async run(message, args, prefix) {
    const USER = this.client.users.cache.get(args[0]) || message.mentions.users.first()
    
      if(!USER) return message.channel.send(`${Emojis.Errado} - ${message.author}, você deve mencionar quem deseja roubar.`)
      
    User.findOne({ _id: USER.id }, async (err, user) => {
      User.findOne({ _id: message.author.id }, async (err, author) => {

        let cooldown = 86400000;
        let steal = author.steal;
        let time = cooldown - (Date.now() - steal);

        if (steal !== null && cooldown - (Date.now() - steal) > 0) {
            return message.channel.send(
              `${Emojis.Cooldown} - ${
                message.author
              }, você deve aguardar **${moment
                .duration(time)
                .format("h [horas], m [minutos] e s [segundos]")
                .replace(
                  "minsutos",
                  "minutos"
                )}** para roubar alguém novamente.`
            );
          } else {
              if(user.coins == 0) return message.channel.send(`${Emojis.Errado} - ${message.author}, este usuário não tem nenhum dinheiro em sua carteira, portanto não é possível roubar ele.`)
            let luck = Math.floor(Math.random() * 4) + 1;

            if(luck == 2) {
            
                let amount = Math.floor(Math.random() * author.coins) + 1

                const FAIL = new ClientEmbed(message.author)
                .setTitle(`${Emojis.Police} - Preso por tentativa de Roubo`)
                .setColor("RED")
                .setDescription(`Você tentou realizar um roubo e acabou sendo preso.\nVocê perdeu um total de **R$${Util.toAbbrev(amount)}**.`)

                await User.findOneAndUpdate({_id: message.author.id}, {$set: {coins: author.coins - amount, steal: Date.now()}})

            return message.channel.send(message.author, FAIL)

            } else {

                let amount = Math.floor(Math.random() * user.coins) + 1

                const SUCESS = new ClientEmbed(message.author)
                .setTitle(`${Emojis.Gun} - Roubo Realizado`)
                .setColor("GREEN")
                .setDescription(`Você roubou o **${USER}** com sucesso.\nVocê conseguiu um total de **R$${Util.toAbbrev(amount)}** neste roubo.`)
                message.channel.send(message.author, SUCESS)
                await User.findOneAndUpdate({_id: USER.id}, {$set: {coins: user.coins - amount}})
                await User.findOneAndUpdate({_id: message.author.id}, {$set: {coins: author.coins + amount, steal: Date.now()}})

            }
          }

      })
    })
  }
};
