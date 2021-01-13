const { ErrorCommand } = require("../");

module.exports = class Event {
    constructor(client) {
        this.client = client
    }

    async UserUtils(user, verify = false) {
        verify = await this.client.database.users.verificar(user.id);
        try {
            if (!verify) {
                await this.client.database.users.add({ _id: author.id })
            } else {
                return this.client.database.users.update(user.id, { $inc: { usedCommands: 1 } })

            }
        } catch (err) {
            throw new ErrorCommand(err);
        }
    }

    async CommandUtils(cmd, verify = false) {
        verify = await this.client.database.comandos.verificar(cmd.commandHelp.name);
        try {
            if (!verify) {
                await this.client.database.comandos.add({
                    _id: cmd.commandHelp.name,
                    utils: {
                        ownerPermission: cmd.commandHelp.ownerNeed,
                        devPermission: cmd.commandHelp.devNeed
                    }
                })
            }
            return this.client.database.comandos.update(cmd.commandHelp.name, { $inc: { usages: 1 } })
        } catch (err) {
            throw new ErrorCommand(err);
        }
    }

    async VerifyCommand({ blacklist, developer, owner, translater, vip }, command, verfy = false) {
        verfy = await this.client.database.comandos.verificar(command.commandHelp.name);
        try {
            if (!verfy) {
                await this.client.database.comandos.add({
                    _id: command.commandHelp.name,
                    utils: {
                        ownerPermission: command.commandHelp.ownerNeed,
                        devPermission: command.commandHelp.devNeed,
                        vipUser: command.commandHelp.vipUser
                    }
                })
            }
            const client = await this.client.database.clientUtils.get(this.client.user.id);
            const {
                maintence,
                utils: { vipUser, ownerPermission, devPermission }
            } = await this.client.database.comandos.findOne(command.commandHelp.name);

            if (blacklist) {
                return { aproved: false, because: 'errors:isClientBlackListed' }
            } if (client.maintence && (!developer) && (!owner)) {
                return { aproved: false, because: 'errors:isClientMaintence' }
            } else if (maintence && (!developer) && (!owner)) {
                return { aproved: false, because: 'errors:isCommandMaintence' }
            } else if (devPermission && (!developer) && (!owner)) {
                return { aproved: false } // because: 'errors:noClientDeveloper'; >> [enable-option] (property)
            } else if (ownerPermission && (!owner)) {
                return { aproved: false } // because: 'errors:noClientOwner' >> [enable-option] (property)
            } else if (vipUser && !vip && !owner) {
                return { aproved: false, because: 'errors:noVipActive' }
            }
            /*
             add the reason goes of your choice [enable the because property]
             */
            return { aproved: true }
        } catch (err) {
            throw new ErrorCommand(err);
        }
    }
}