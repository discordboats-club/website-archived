const { Client } = require("discord.js"); // for jsdoc
const randomstring = require("randomstring");
const fs = require("fs");
let secret;
module.exports = class ConstantStore {
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
let r = module.exports.r = require("rethinkdbdash")({db: "discordboatsclub"});;
let bot = module.exports.bot = require("./bot");

/* To use this, you just require("./getConstants").r and it'll give you the database. Same with bot.*/