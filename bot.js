const { Client } = require("discord.js");
const { r } = require("./app");
const client = module.exports = new Client({disableEveryone: true, presence: {activity: {name: "with boats"}}});
const config = require("./config.json");
client.login(config.token);

client.once("ready", () => console.log(`[discord] Logged in as ${client.user.tag}.`));