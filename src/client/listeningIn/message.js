const Guild = require('../../database/Schemas/Guild')

module.exports = class {
    constructor(client) {
        this.client = client
    }

    async run (message) {
        if(message.author.bot) return;

        if (message.content.indexOf(prefix) !== 0) return
        const args = message.content.slice(prefix.length).trim().split(/ +/g)
        const command = args.shift().toLowerCase()

        if (message.guild && !message.member) await message.guild.fetchMember(message.author)

        const cmd = this.client.commands.get(command) || this.client.commands.get(this.client.aliases.get(command))
        if (!cmd) return message.channel.send("Command not found.")
        cmd.run(message, args)
    }
}