const marked = require("marked");
const escapeHTML = require("escape-html");
const moment = require("moment");
module.exports = class Utils {
    /**
     * @param {Object} bot 
     * @returns {Object}
     */
    static attachPropBot(bot, user = {}) {
        const client = require("./ConstantStore").bot;
        const botUser = client.users.get(bot.id) || client.users.fetch(bot.id);
        bot.online = typeof botUser !== "undefined" ? botUser.presence.status !== "offline" : undefined; 
        bot.servers = "N/A";
        bot._discordAvatarURL = botUser.avatarURL();
        bot._markedDescription = marked(escapeHTML(bot.longDescription), {});
        bot._ownerViewing = user.id === bot.ownerID;
        return bot;
    }
    /**
     * @param {Object} user
     * @returns {Object} 
     */
    static async attachPropUser(user) {
        const client = require("./ConstantStore").bot;
        const { r } = require("./ConstantStore");
        const discordUser = client.users.get(user.id) || client.userss.fetch(user.id);
        user._discordAvatarURL = discordUser.avatarURL();
        user._bots = await r.table("bots").filter({ownerID: user.id}).run(); // might call attachPropBot here if needed.
        user._verifiedBots = user._bots.filter(bot => bot.verified);
        user._fmtCreatedAt = moment(user.createdAt).fromNow();
        console.log(user);
        return user;
    }
}