const { Client } = require('discord.js');
const client = module.exports = new Client({ disableEveryone: true });

client.once('ready', () => {
    console.log(`[discord] logged in as ${client.user.tag}`);
    client.user.setActivity('with boats');
});
