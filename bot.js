const { Client } = require("discord.js");
const { r } = require("./app");
const client = module.exports = new Client({disableEveryone: true, presence: {activity: {name: "with boats"}}});
const config = require("./config.json");
client.login(config.token);

client.once("ready", () => console.log(`[discord] Logged in as ${client.user.tag}.`));

client.on('message', async (msg) => {
    if (msg.author.bot || msg.author.id == client.user.id) return;
    const cmd = msg.content.split(' ')[0].toLowerCase();
    const args = msg.content.split(' ');
    const prefix = '!';

    switch(cmd) {
        case prefix + 'ping':
            msg.channel.send('Pong!');
            break;
    }

});