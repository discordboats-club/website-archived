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
        case prefix + "eval":
            if (msg.author.id !== "142244934139904000") return;
            try {
                const js = args.join(" ");
                let res = eval(js);
                if (res instanceof Promise) res = await res;
                if (typeof res !== "string") res = require("util").inspect(res, false, 0);
                await msg.channel.send(`\`\`\`js\n${res}\n\`\`\``);
            } catch (error) {
                await msg.channel.send(`error!\n\`\`\`\n${error}\n\`\`\``);
            }
        break;
    }

});