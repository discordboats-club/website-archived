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

client.on('guildMemberRemove', async (member) => {
    const loadedBots = await r.table('bots').filter({ ownerID: member.user.id }).run();
    if (loadedBots.length !== 0) {
        const modChannel = client.channels.find('name', 'mod-chat');
        modChannel.send(`<@&436737982737678346> **${member.user.tag}** (\`${member.user.id}\`) left the guild, but they have **${loadedBots.length}** bots on the list. They consist of: **${loadedBots.map(b => b.name).join(', ')}**.`);
    }
    if (member.bot) {
        if (!loadedBots.map(b => b.id).includes(member.user.id)) return;
        const bot = loadedBots[member.user.id];
        const modChannel = client.channels.find('name', 'mod-chat');
        modChannel.send(`<@&436737982737678346> **${member.user.tag}** (\`${member.user.id}\`) left the guild, but they are a bot currently on the list. Their owner is **${bot.ownerID}** (<@${bot.ownerID}>).)`);        
    }
});