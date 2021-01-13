const GetMention = (id) => new RegExp(`^<@!?${id}>( |)$`);

module.exports = class {
    constructor(client) {
        this.client = client
    }

    async run(message) {
        if (message.author.bot) return

        const prefix = process.env.PREFIX

        if (message.content.match(GetMention(this.client.user.id))) {
            message.channel.send(
              `Olá ${message.author}.\nSou o Bot Oficial da **${process.env.SERVER_NAME}**, caso queira saber minha lista de comandos use **${prefix}help**`
            );
          }

        if (message.content.indexOf(prefix) !== 0) return
        const args = message.content.slice(prefix.length).trim().split(/ +/g)
        const command = args.shift().toLowerCase()

        if (message.guild && !message.member) await message.guild.fetchMember(message.author)

        const cmd = this.client.commands.get(command) || this.client.commands.get(this.client.aliases.get(command))
        if (!cmd) return message.channel.send("Command not found.")
        cmd.run(message, args, prefix)
    }
}
