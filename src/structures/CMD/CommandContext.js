module.exports = class CommandContext {
    constructor(options = {}) {
        this.client = options.client
        this.message = options.message
        this.developer = options.developer
        this.author = options.message.author
        this.member = options.message.member
        this.channel = options.message.channel
        this.owner = options.owner
        this.aliase = options.aliase
        this.language = options.language
        this.prefix = options.prefix
        this.usedPrefix = options.usedPrefix
        this.voiceChannel = options.message.member ? options.message.member.voiceChannel : null
        this.guild = options.message.guild
        this.command = options.command
        this.args = options.args
        this.t = options.client.language.i18next.getFixedT(options.language)
    }
}