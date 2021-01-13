module.exports = class Command {
    constructor(client) {
        this.client = client

        this.name = 'commandName'
        this.category = 'Category'
        this.description = 'Not description'
        this.aliases = []

        this.enabled = true
        this.guildOnly = false
    }

    async run() {}
}
