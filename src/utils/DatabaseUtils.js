module.exports = class DatabaseUtils {
    constructor(client) {
        this.client = client
    }

    async ClientMaintence(maintence) {
        return await this.client.database.clientUtils.update(this.client.user.id, { $set: { maintence } })
    }

    async CommandMaintence(command, maintence) {
        if (!command) throw new Error('unidentified command');
        return await this.client.database.comandos.update(command, { $set: { maintence } })
    }

    async setLogsChannel(guild, logschannel) {
        if (!guild) throw new Error('unidentified channel');
        return await this.client.database.guilds.update(guild.id, { $set: { logschannel } })
    }

    async setAutoRoleID(guild, roles) {
        if (!guild) throw new Error('unidentified role');
        return await this.client.database.guilds.update(guild.id, { $push: { 'zautorole.roles': roles } })
    }

    async setAntiFakeDays(guild, antifakedays) {
        if (!guild) throw new Error('unidentified number');
        return await this.client.database.guilds.update(guild.id, { $set: { antifakedays } })
    }

    async setAntInviteMSG(guild, msg) {
        if (!guild) throw new Error('unidentified message');
        return await this.client.database.guilds.update(guild.id, { $set: { 'zantinvite.msg': msg } })
    }

    async setNickPadrao(guild, nickp) {
        if (!guild) throw new Error('unidentified nick');
        return await this.client.database.guilds.update(guild.id, { $set: { nickp } })
    }

    async setChatContador(guild, chatcontador) {
        if (!guild) throw new Error('unidentified channel');
        return await this.client.database.guilds.update(guild.id, { $set: { chatcontador } })
    }

    async setMsgContador(guild, msgcontador) {
        if (!guild) throw new Error('unidentified message');
        return await this.client.database.guilds.update(guild.id, { $set: { msgcontador } })
    }

    async setByeByeMsg(guild, msg) {
        if (!guild) throw new Error('unidentified message');
        return await this.client.database.guilds.update(guild.id, { $set: { 'byebye.msg': msg } })
    }

    async setByeByeChannel(guild, canal) {
        if (!guild) throw new Error('unidentified channel');
        return await this.client.database.guilds.update(guild.id, { $set: { 'byebye.canal': canal } })
    }

    async setByeByeMsgDM(guild, dm) {
        if (!guild) throw new Error('unidentified message');
        return await this.client.database.guilds.update(guild.id, { $set: { 'byebye.dmmsg': dm } })
    }

    async setWelcomeChannel(guild, canal) {
        if (!guild) throw new Error('unidentified channel');
        return await this.client.database.guilds.update(guild.id, { $set: { 'welcome.canal': canal } })
    }

    async setWelcomeMsg(guild, msg) {
        if (!guild) throw new Error('unidentified message');
        return await this.client.database.guilds.update(guild.id, { $set: { 'welcome.msg': msg } })
    }

    async setWelcomeMsgDM(guild, dm) {
        if (!guild) throw new Error('unidentified message');
        return await this.client.database.guilds.update(guild.id, { $set: { 'welcome.dmmsg': dm } })
    }

    async setPrefix(guild, prefix) {
        if (!guild) throw new Error('unidentified server');
        return await this.client.database.guilds.update(guild.id, { $set: { prefix } })
    }

    async setLanguage(guild, language) {
        if (!guild) throw new Error('unidentified server');
        return await this.client.database.guilds.update(guild.id, { $set: { language } })
    }

    async setLink(user, redirect) {
        if (!user) throw new Error('unidentified user');
        return await this.client.database.users.update(user.id, { $set: { 'contributor.redirect': redirect } })
    }

    async setOwner(user, owner) {
        if (!user) throw new Error('unidentified user');
        return await this.client.database.users.update(user.id, { $set: { 'contributor.owner': owner } })
    }
  
    async setGerente(user, gerente) {
        if (!user) throw new Error('unidentified user');
        return await this.client.database.users.update(user.id, { $set: { 'contributor.gerente': gerente } })
    }

    async setCoordenador(user, coordenador) {
        if (!user) throw new Error('unidentified user');
        return await this.client.database.users.update(user.id, { $set: { 'contributor.coordenador': coordenador } })
    }

    async setSuporte(user, suporte) {
        if (!user) throw new Error('unidentified user');
        return await this.client.database.users.update(user.id, { $set: { 'contributor.suporte': suporte } })
    }

    async setDeveloper(user, developer) {
        if (!user) throw new Error('unidentified user');
        return await this.client.database.users.update(user.id, { $set: { 'contributor.developer': developer } })
    }

    async setDesigner(user, designer) {
        if (!user) throw new Error('unidentified user');
        return await this.client.database.users.update(user.id, { $set: { 'contributor.designer': designer } })
    }

    async setTranslater(user, translater) {
        if (!user) throw new Error('unidentified user');
        return await this.client.database.users.update(user.id, { $set: { 'contributor.translater': translater } })
    }

    async setBlacklist(user, blacklist) {
        if (!user) throw new Error('unidentified user');
        return await this.client.database.users.update(user.id, { $set: { 'blacklist': blacklist } })
    }

    async removeCopyEmojis(g, user) {
        if (!(g || user)) throw new Error('unidentified parameters');
        return await this.client.database.users.update(user.id, { $pull: { 'utils.copyEmojis': g } })
    }

    async setCopyEmojis(emojis, user, guild, update = false) {
        if (!(emojis || user || guild)) throw new Error('unidentified parameters');

        if (update) {
            const guildEm = await this.client.database.users.findOne(user.id).then((d) => d.utils.copyEmojis.find(e => e.guildID == guild.id));
            await this.client.database.users.update(user.id, { $pull: { 'utils.copyEmojis': guildEm } });
        }

        const em = [];
        await Promise.all(emojis.map(e => {
            let animated = e.url.endsWith('.png') || e.url.endsWith('.jpg') ? false : true;
            em.push({ url: e.url, name: e.name, animated })
        }));
        return await this.client.database.users.update(user.id, {
            $push: {
                'utils.copyEmojis': {
                    guildID: guild.id,
                    guildName: guild.name,
                    emojisSize: emojis.size,
                    emojis: em
                }
            }
        })
    }
}