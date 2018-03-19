const express = require("express");
const app = module.exports = express.Router();
const Joi = require("joi");
// datamined from the discord api docs
const libList = ["discordcr","Discord.Net","DSharpPlus","dscord","DiscordGo","Discord4j","JDA","discord.js","Eris","Discordia","RestCord","Yasmin","discord.py","disco","discordrb","discord-rs","Sword"];
app.use((req, res, next) => {
    if (req.isAuthenticated()) next();
    else {
        res.status(403).json({error: "not_authenticated"});
    }
});

app.get("/", (req, res) => {
    res.json({success: "you found the api!"});
});

// ha just kidding! you came here because of my troll commit :^) no but seriously why would you do such a mean thing to the LEAD FRONTEND DEV
// i guess this means demote

function filterUnexpectedData(orig, startingData, schema) {
    const data = Object.assign({}, startingData);
    Object.keys(schema.describe().children).forEach(key => {
        data[key] = orig[key];
    });
    return data;
}

const newBotSchema = Joi.object().keys({
    shortDescription: Joi.string().max(200).required(),
    id: Joi.string().length(18).required(),
    longDescription: Joi.string().max(1500).required(),
    invite: Joi.string().uri({scheme: ["https", "http"]}).required(),
    website: Joi.string().uri({scheme: ["https", "http"]}),
    library: Joi.string()
});

app.post("/bot", async (req, res) => {

    const wdjt = Joi.validate(req.body, newBotSchema); // What Does Joi Think (wdjt)
    if (wdjt.error) {
        if (!wdjt.error.isJoi) {
            console.error("Error while running Joi for signup data validation.", wdjt.error);
            res.sendStatus(500);
            return;
        }
        res.status(400).json({error: wdjt.error.name, details: wdjt.error.details.map(item => item.message)});
        return;
    }

    const data = filterUnexpectedData(req.body, {ownerID: req.user.id, createdAt: new Date().getTime(), verified: false}, newBotSchema);
    if (data.library && !data.library.includes(libList)) return res.status(400).json({error: "Invalid Library"});

    const { r } = require("./ConstantStore");

    // does bot already exist?
    const dbeBot = await r.table("bots").get(data.id);
    if (dbeBot) return res.status(302).json({error: "Bot already exists"});


    // everything looks good.
    await r.table("bots").insert(data).run();
    res.status(200).json({ok: "Created bot"});
});

app.delete("/bot", async (req, res) => {
    const { r } = require("./ConstantStore");
    if (typeof req.body.id !== "string") return res.status(400).json({error: "Expected Payload's id property to be a string."})
    const bot = await r.table("bots").get(req.body.id).run();
    if (bot.ownerID !== req.user.id) return res.status(403).json({error: "You can't delete a bot you don't own!"});
    await r.table("bots").get(req.body.id).delete();
    res.status(200).json({ok: "Deleted bot."});
});

app.get("/me", (req, res) => {
    res.json({id: req.user.id,
             discord: {
                username: req.user.discord.username,
                discrim: req.user.discord.discriminator
             }
        });
});

app.use((req, res) => {
    res.status(404).json({error: "endpoint_not_found"});
});