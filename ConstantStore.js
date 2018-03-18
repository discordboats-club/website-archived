const { Client } = require("discord.js"); // for jsdoc
const randomstring = require("randomstring");
let r;
let bot;
let secret;
module.exports = class ConstantStore {
    static get r() {
        if (!r) r = require("rethinkdbdash")({db: "discordboatsclub"});
        return r;
    }
    /**
     * @returns {Client}
     */
    static get bot() {
        if (!bot) bot = require("./bot");
        return bot;
    }
    /**
     * @returns {String}
     */
    static get secret() {
        if (fs.existsSync("secret")) return fs.readFileSync("secret").toString();
        else {
            secret = randomstring.generate(500);
            fs.writeFileSync("secret", secret);
            return secret;
        }
    }
}

/* To use this, you just require("./getConstants").r and it'll give you the database. Same with bot.*/