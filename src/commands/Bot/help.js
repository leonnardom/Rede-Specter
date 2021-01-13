const Command = require('../../structure/Command')
	  DiscordEmbed = require('../../structure/ClientEmbed')

module.exports = class Help extends Command {
	constructor(client) {
		super(client)
        this.client = client

        this.name = 'help'
        this.category = 'Bot'
        this.description = 'Veja a Lista de comandos do Bot'
        this.aliases = ['ajuda']

        this.enabled = true
        this.guildOnly = false
	   }
	async run(message) {
		let embed = new DiscordEmbed(message.author)
		.setDescription("Ping!")
		message.channel.send(embed).then(msg => {
			msg.edit(embed.setDescription(`Pong! ${Math.round(this.client.ws.ping) + 'ms'}`))
		})
	}
}
