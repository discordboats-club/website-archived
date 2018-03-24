const marked = require("marked");
const escapeHTML = require("escape-html");
module.exports = class Utils {
    /**
     * @param {Object} bot 
     * @returns {Object}
     */
    static attachPropBot(bot) {
        const client = require("./ConstantStore").bot;
        const botUser = client.users.get(bot.id);
        bot.online = typeof botUser !== "undefined" ? botUser.presence.status !== "offline" : undefined; 
        bot.servers = "N/A";
        bot._markedDescription = marked(escapeHTML(bot.longDescription));
        return bot;
    }
}