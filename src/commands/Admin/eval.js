const Command = require('../../structure/Command');
      DiscordEmbed = require('../../structure/ClientEmbed'),
      { ownerid } = process.env.OWNER_ID

module.exports = class Eval extends Command {
    constructor(client) {
        super(client)
        this.client = client

        this.name = 'eval'
        this.category = 'Admin'
        this.description = 'Eval do Bot'
        this.aliases = []

        this.enabled = true
        this.guildOnly = false
    }
    async run(message, args){
        if (!message.author.id == ownerid) return message.channel.send("Sem permissão")
        try {
            let argumentos = args.join(" ");
            if(!argumentos) return message.channel.send(`${message.author}, escreve algo primeiro.`)
            let code = eval(argumentos)
    
            if (typeof code !== 'string')
                code = require('util').inspect(code, { depth: 0 });
            let embed = new DiscordEmbed(message.author)
            .addField('Entrada', `\`\`\`js\n${argumentos}\`\`\``)
            .addField('Saída', `\`\`\`js\n${code}\n\`\`\``)
            message.channel.send(embed)
        } catch(e) {
            message.channel.send(`\`\`\`js\n${e}\n\`\`\``);
        }
    }
}
