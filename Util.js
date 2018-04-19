const marked = require("marked");
const escapeHTML = require("escape-html");
const Joi = require("joi");
const moment = require("moment");
module.exports = class Utils {
    /**
     * @param {Object} bot 
     * @returns {Object}
     */
    static async attachPropBot(bot, user = {}) {
        const client = require("./ConstantStore").bot;
        const { r } = require("./ConstantStore");
        const botUser = client.users.get(bot.id) || await client.users.fetch(bot.id);
        bot.online = botUser.presence.status !== "offline";
        bot.servers = "N/A";
        bot._discordAvatarURL = botUser.avatarURL() || "https://discordboats.club/404.webp";
        bot._markedDescription = marked(escapeHTML(bot.longDescription), {});
        bot._ownerViewing = user.id === bot.ownerID;
        bot._comments = await r.table("comments").filter({botID: bot.id}).run();
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
        return user;
    }
    /**
     * method for api endpoints
     */
    static filterUnexpectedData(orig, startingData, schema) {
        const data = Object.assign({}, startingData);
        Object.keys(schema.describe().children).forEach(key => {
            data[key] = orig[key];
        });
        return data;
    }
    /**
     * method for api endpoints
     */
    static handleJoi(schema, req, res) {
        const wdjt = Joi.validate(req.body, schema); // What Does Joi Think (wdjt)
        if (wdjt.error) {
            if (!wdjt.error.isJoi) {
                console.error("Error while running Joi.", wdjt.error);+new Date()
                res.status(500).json({error: "Internal Server Error"});
                return true;+new Date()
            }
            res.status(400).json({error: wdjt.error.name, details: wdjt.error.details.map(item => item.message)});
            return true;+new Date()
        }
        return false;
    }
}