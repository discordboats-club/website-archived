const { Client } = require("discord.js");
const { r } = require("./ConstantStore");
const client = module.exports = new Client({disableEveryone: true, presence: {activity: {name: "with boats"}}});
const config = require("./config.json");
client.login(config.token);

client.once("ready", () => console.log(`[discord] Logged in as ${client.user.tag}.`));

client.on("message", async (msg) => {
    if (msg.author.bot || msg.author.id === client.user.id) return;
    const cmd = msg.content.split(" ")[0].toLowerCase();
    const args = msg.content.split(" ").slice(1);
    const prefix = "discordboats";

    switch(cmd) {
        case prefix + "ping":
            await msg.channel.send("Pong!");
        break;
    }

});