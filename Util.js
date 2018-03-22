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
        return bot;
    }
}