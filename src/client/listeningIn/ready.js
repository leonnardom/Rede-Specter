const Event = require("../../structures/Event.js");
const ms = require("parse-ms");
const { ClientEmbed, Emojis } = require("../../");
const moment = require('moment')
const SLEEP = async () => {
  return Number((Math.random() * (60 - 30) + 500).toFixed(0) + "000");
};

module.exports = class ReadyEvent extends (
  Event
) {
  constructor(client) {
    super(client);

    this.client = client;
    this.name = "ready";
  }

  async ON() {
    if (this.client.shard) await this.ShardManager();

    const timeOut = (ms) => setTimeout(UPDATE_PRESENCE, ms);
    const UPDATE_PRESENCE = async () => {
      const RESPONSE = await new Promise(async (resolve, rejection) => {
        try {
          resolve(await this.PRESENCE());
        } catch (error) {
          rejection({ err: true, error });
        }
      });
    
      console.log(
        RESPONSE.err
          ? `\x1b[31m[SHARD ${
              this.client.shard.id + 1
            } - ERROR_PRESENCE]\x1b[0m`
          : `\x1b[34m[SHARD ${
              this.client.shard.id + 1
            } - PRESENCE_UPDATE]\x1b[0m`,
        RESPONSE.err
          ? RESPONSE.error
          : JSON.stringify(RESPONSE.localPresence.activities)
      );
      return timeOut(await SLEEP());
    };

    return timeOut();
  }

  async PRESENCE(GC, text) {
    const users = await this.client.ShardUtils.getMembersSize();
    const guilds = await this.client.shard
      .broadcastEval("this.guilds.cache.size")
      .then((res) => res.reduce((a, b) => a + b, 0));
      this.client.user.setStatus("dnd");

    /*if (this.client.user.presence.activities && !!this.client.user.presence.activities.name.match(/servers+/gi) && !GC) {
            text = `${users} Users`
            this.client.RandomMatch.type = 0
        } else {
            text = `🦊 ${guilds} Servers`
            this.client.RandomMatch.type = 0
        }*/
    /*let activities = [`🦊 ${guilds} servidores`, `👤 ${users} usuários`],
      i = 0;


    return await setInterval(
      () =>
        this.client.user.setActivity(
          `${activities[i++ % activities.length]} || @${
            this.client.user.username
          } help`,
          {
            type: "PLAYING",
          }
        ),
      1000 * 60
    );*/
  }

  async ShardManager() {
    this.client.ShardUtils = {
      getMembersSize: async () => {
        return await this.client.shard
          .broadcastEval(
            `
                     let count = 0;
                     this.guilds.cache.forEach(g=> count += g.memberCount);
                     count;
                 `
          )
          .then((res) => res.reduce((a, b) => a + b, 0));
      },
      getGuildsSize: async () => {
        return await this.client.shard
          .broadcastEval("this.guilds.cache.size")
          .then((res) => res.reduce((a, b) => a + b, 0));
      },
      send: async (guild, channel, msg) => {
        if (this.client.guilds.cache.get(guild)) {
          try {
            return this.client.guilds.cache
              .get(guild)
              .channels.cache.get(channel)
              .send(msg)
              .catch(this.client.LOG_ERR);
          } catch (err) {}
        } else {
          return this.client.shard.broadcastEval(`
                         try {
                             this.guilds.cache.get('${guild}').channels.get('${channel}').send('${msg}')
                         } catch (err) { }
                     `);
        }
      },
      getSharedServers: async (user) => {
        return await this.client.shard
          .broadcastEval(
            `
                     try {
                         this.guilds.cache.filter(guild => guild.member('${user.id}')).map(guild => guild.name)
                     } catch (err) { }
                 `
          )
          .then((result) => {
            // filter the results 'undefinded'
            result = result.filter((res) => res);
            const ARR = [];
            // unpack
            if (result) {
              Promise.all(
                result.map((g) => {
                  if (Array.isArray(g)) {
                    g.map((map) => ARR.push(map));
                  } else {
                    ARR.push(g);
                  }
                })
              );
            }
            return ARR;
          });
      },
    };

    return (() => {
      this.client
        .on("error", this.client.LOG_ERR)
        .on("warn", this.client.LOG_ERR)
        .on("debug", (debug) => {
          console.log(
            `\x1b[35m[SHARD ${this.client.shard.id + 1}]\x1b[0m`,
            `${debug}`
          );
        })
        .on("updatePresence", (param) => this.PRESENCE(param));

      process.on("unhandledRejection", (rejection) => {
        console.error(
          `-\n\n==========unhnadledRejection==========\nREJEIÇÃO NÃO TRATADA:\n${rejection.stack}\n==================================\n\n-`
        );
      });
      process.on("uncaughtException", (exception) => {
        console.error(
          `-\n\n==========uncaughtException==========\n${exception}\n${exception.stack}\n==================================\n\n-`
        );
      });
    })();
  }
};
