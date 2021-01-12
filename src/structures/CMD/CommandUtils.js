const CommandManager = require("./CommandManager.js");

module.exports = class CommandUtils extends CommandManager {
    constructor(client) {
        super(client)
        this.client = client
    }

    async GetUser(args, message, guild, author, userGuild = false) {
        args = (args && Array.isArray(args) ? args.join(' ') : args ? args : false);
        let user = false

        try {
            if (args) {
                if (message && message.mentions.users.first()) {
                    user = message.mentions.users.first()
                } else {
                    if (!(isNaN(args))) {
                        if (!userGuild && this.client.users.fetch(args)) {
                            user = await this.client.users.fetch(args).then(user => user)
                        } else if (guild && guild.members.cache.get(args)) {
                            user = guild.members.cache.get(args).user;
                        }
                    }

                    if (!user) {
                        if (guild) {
                            if (guild.members.cache.find(user => user.displayName.toLowerCase() === args.toLowerCase() || user.displayName.toLowerCase().includes(args.toLowerCase()))) {
                                user = guild.members.cache.find(user => user.displayName.toLowerCase() === args.toLowerCase() || user.displayName.toLowerCase().includes(args.toLowerCase())).user
                            } else if (guild.members.cache.find(u => u.user.tag.toLowerCase() === args.toLowerCase() || u.user.tag.toLowerCase().includes(args.toLowerCase()))) {
                                user = guild.members.cache.find(u => u.user.tag.toLowerCase() === args.toLowerCase() || u.user.tag.toLowerCase().includes(args.toLowerCase())).user
                            }
                        }

                        if (!user) {
                            if (!userGuild && this.client.users.cache.find(user => user.tag.toLowerCase() === args.toLowerCase() || user.tag.toLowerCase().includes(args.toLowerCase()))) {
                                user = this.client.users.cache.find(user => user.tag.toLowerCase() === args.toLowerCase() || user.tag.toLowerCase().includes(args.toLowerCase()))
                            } else if (!userGuild && this.client.users.cache.find(user => user.username.toLowerCase() === args.toLowerCase() || user.username.toLowerCase().includes(args.toLowerCase()))) {
                                user = this.client.users.cache.find(user => user.username.toLowerCase() === args.toLowerCase() || user.username.toLowerCase().includes(args.toLowerCase()))
                            }
                        }
                    }
                }
            } else {
                user = author
            }
            return user ? user : author;
        } catch (err) {
            this.client.LOG_ERR(err);
            return author;
        }
    }

    getRole(args, message, guild) {
        args = (args && Array.isArray(args) ? args.join(' ') : args ? args : false);
        let role = false

        try {
            if (args) {
                let roles = guild.roles.cache.map(r => r).slice(1);
                if (message.mentions.roles.first()) {
                    role = message.mentions.roles.first()
                } else if (!(isNaN(args))) {
                    if (roles.cache.find(role => role.id === args)) {
                        role = roles.cache.find(role => role.id === args)
                    }
                }
                if (!role) {
                    if (roles.cache.find(role => role.name.toLowerCase() === args.toLowerCase())) {
                        role = roles.cache.find(role => role.name.toLowerCase() === args.toLowerCase())
                    }
                }
            } else {
                role = false
            }
            return role;
        } catch (err) {
            return false;
        }
    }

    GetChannel(args, message, guild, channel) {
        args = (args && Array.isArray(args) ? args.join(' ') : args ? args : false);
        let channelSearch = false

        try {
            if (args) {
                if (message.mentions.channels.first()) {
                    channelSearch = message.mentions.channels.first()
                } else if (!(isNaN(args))) {
                    if (guild.channels.cache.find(channel => channel.id === args)) {
                        channelSearch = guild.channels.cache.find(channel => channel.id === args)
                    }
                }

                if (!channelSearch) {
                    if (guild.channels.cache.find(channel => channel.name.toLowerCase() === args.toLowerCase())) {
                        channelSearch = guild.channels.cache.find(channel => channel.name.toLowerCase() === args.toLowerCase())
                    }
                }
            } else {
                channelSearch = channel
            }
            return channelSearch ? channelSearch : channel;
        } catch (err) {
            return false;
        }
    }

    GetEmoji(args, guild) {
        args = (args && Array.isArray(args) ? args.join(' ') : args ? args : false);
        let emoji = false

        try {
            if (args) {
                if (!(isNaN(args))) {
                    if (guild.emojis.cache.get(args)) {
                        emoji = guild.emojis.cache.get(args);
                    }
                } else if (args.includes("<") && args.includes(">")) {
                    let verifyEmoji = args.split(':')[1];

                    if (verifyEmoji && guild.emojis.cache.find(emoji => emoji.name == verifyEmoji)) {
                        emoji = guild.emojis.cache.find(emoji => emoji.name == verifyEmoji);
                    }
                }

                if (!emoji) {
                    if (guild.emojis.cache.find(emoji => emoji.name.toLowerCase() === args.toLowerCase())) {
                        emoji = guild.emojis.cache.find(emoji => emoji.name.toLowerCase() === args.toLowerCase())
                    } else if (guild.emojis.cache.find(emoji => emoji.name.toLowerCase().includes(args.toLowerCase()))) {
                        emoji = guild.emojis.cache.find(emoji => emoji.name.toLowerCase().includes(args.toLowerCase()))
                    }
                }
            } else {
                emoji = false
            }
            return emoji ? emoji : false;
        } catch (err) {
            return false;
        }
    }
}