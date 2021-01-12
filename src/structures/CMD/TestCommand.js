const ErrorCommand = require("./ErrorCommand.js");
const CommandUtils = require("./CommandUtils.js");
const ClientEmbed = require("../ClientEmbed.js");

module.exports = class TestCommand extends CommandUtils {
    constructor(client) {
        super(client)
        this.client = client
    }

    async verify(settings, { message, language, author, command, prefix, channel, t } = settings) {
        try {
            if (this.subcommand) {
                return await this.cmdVerify(settings);
            }

            if (channel.type === "dm" || (message.guild && channel.permissionsFor(this.client.user).has('SEND_MESSAGES'))) {
                if (this.needGuild && !message.guild) return;

                if ((!t)) {
                    return channel.send(new ClientEmbed(author)
                        .setDescription(this.client.Errors.language[language])
                        .setColor(process.env.ERROR_COLOR)
                    ).catch(() => { });
                }

                return await this.cmdVerify(settings);
            } else {
                return settings = null;
            }
        } catch (e) {
            return ErrorCommand.commandError(
                this.client,
                channel,
                command,
                author,
                prefix,
                t,
                e
            )
        }
    }

    async cmdVerify(settings) {
        const ClientNeedPerm = ({ need: false, perms: [] });
        const UserNeedPerm = ({ need: false, perms: [] });
        const { message, developer, author, t } = settings

        if (message.guild) {
            if (this.Permissions.length) {
                await this.ClientPermissions(this.Permissions, message, author, ClientNeedPerm, t)
            }
            if ((!developer) && (this.UserPermissions.length)) {
                await this.MemberPermissions(this.UserPermissions, message, author, UserNeedPerm, t)
            }
        }

        if (!ClientNeedPerm.need && !UserNeedPerm.need) {
            return this._run(settings).catch(this.client.LOG_ERR);
        } else {
            settings = null
            return false;
        }
    }

    ClientPermissions(perms, message, user, ClientNeedPerm, t, ERR_USAGE = '') {
        for (const perm of perms) {
            if (!(message.channel.permissionsFor(this.client.user).has(perm))) {
                ClientNeedPerm.perms.push(perm)
            }
        }

        if (ClientNeedPerm.perms.length) {
            ClientNeedPerm.need = true
            if (ClientNeedPerm.perms.length > 1) {
                ERR_USAGE = 'errors:botMissingMultiplePermissions'
            } else {
                ERR_USAGE = 'errors:botMissingOnePermission'
            }

            return message.channel.send(new ClientEmbed(user)
                .setDescription(t(`${ERR_USAGE}`, { permission: ClientNeedPerm.perms.map(perm => `**"${perm}"**`).join(", ") }))
                .setColor(process.env.ERROR_COLOR));
        } else {
            return true;
        }
    }

    MemberPermissions(perms, message, user, UserNeedPerm, t, ERR_USAGE = '') {
        for (const perm of perms) {
            if (!(message.channel.permissionsFor(user).has(perm))) {
                UserNeedPerm.perms.push(perm)
            }
        }

        if (UserNeedPerm.perms.length) {
            UserNeedPerm.need = true
            if (UserNeedPerm.perms.length > 1) {
                ERR_USAGE = 'errors:missingMultiplePermissions'
            } else {
                ERR_USAGE = 'errors:missingOnePermission'
            }
            return message.channel.send(new ClientEmbed(user)
                .setDescription(t(`${ERR_USAGE}`, { permission: UserNeedPerm.perms.map(perm => `**"${perm}"**`).join(", ") }))
                .setColor(process.env.ERROR_COLOR));
        } else {
            return true;
        }
    }
}