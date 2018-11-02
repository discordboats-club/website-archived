const express = require("express");
const app = module.exports = express.Router();
const Joi = require("joi");
const snekfetch = require("snekfetch");
let badBots = [];
const { r } = require("../ConstantStore");
const randomString = require("randomstring");
const Util = require("../Util");
// datamined from the discord api docs
const libList = module.exports.libList = ["discordcr","Discord.Net","DSharpPlus","dscord","DiscordGo","Discord4j","JDA","discord.js","Eris","Discordia","RestCord","Yasmin","discord.py","disco","discordrb","discord-rs","Sword"];


snekfetch.get("https://gist.githubusercontent.com/RONTheCookie/c209f333d14fd85b3b6ae00243bff2cd/raw/dd5a159320ea5faa54c8616315b3deccfd601b3e/badbots.txt").then(res => {
    let raw = res.text.toString();
    badBots = raw.split("\n").map(bt => bt.split(" ")[0]);
    console.log(`[api-route] loaded ${badBots.length} bad bots.`);
});

app.get("/search/autocomplete", async (req, res) => {
    const q = req.query.q;
    if (typeof q !== "string") return res.sendStatus(400);
    const bots = (await r.table("bots").filter(bot => bot("name").downcase().match("^"+q.toLowerCase()).and(bot("verified"))).pluck("name").limit(5).run()).map(bot => bot.name);
    res.json({ok: "View data property", data: bots});
});



app.use((req, res, next) => {
    if (req.isAuthenticated()) next();
    else {
        res.status(401).json({error: "not_authenticated"});
    }
});

app.get("/", (req, res) => {
    res.json({ok: "you found the api!"});
});


const newBotSchema = Joi.object().required().keys({
    shortDescription: Joi.string().max(200).required(),
    id: Joi.string().length(18).required(),
    longDescription: Joi.string().max(12000).required(),
    prefix: Joi.string().max(50).required(),
    invite: Joi.string().uri({scheme: ["https", "http"]}).required(),
    website: Joi.string().uri({scheme: ["https", "http"]}),
    library: Joi.string(),
    github: Joi.string().uri({scheme: ["https"]}) // gh is just https
});


// bot resource
app.post("/bot", async (req, res) => {
    const client = require("../ConstantStore").bot;
    if (Util.handleJoi(newBotSchema, req, res)) return;
    const data = Util.filterUnexpectedData(req.body, {inviteClicks: 0, pageViews: 0, apiToken: randomString.generate(30), ownerID: req.user.id, createdAt: +new Date(), verified: false}, newBotSchema);
    if (data.library && !libList.includes(data.library)) return res.status(400).json({error: "Invalid Library"});
    if (data.github && !data.github.startsWith("https://github.com/")) return res.status(400).json({error: "Invalid Github URL"});
    if (badBots.includes(data.id)) res.status(403).json({error: "Blacklisted bot."});

    const botUser = client.users.get(data.id) || await client.users.fetch(data.id);
    if (!client.users.get(data.ownerID) || !await client.users.fetch(data.ownerID)) return res.status(403).json({ error: "Owner is not in Discord guild" });
    if (!botUser) return res.status(404).json({error: "Invalid Bot ID"});
    if (!botUser.bot) return res.status(400).json({error: "bot can only be a bot"});
    data.name = botUser.username;

    // does bot already exist?
    const dbeBot = await r.table("bots").get(data.id).run();
    if (dbeBot) return res.status(302).json({error: "Bot already exists"});


    // everything looks good.
    await r.table("bots").insert(data).run();
    res.status(200).json({ok: "Created bot"});
    client.channels.get("425170250548379664").send(`<:submitted:436830297175097345> <@${req.user.id}> added ${botUser.tag} (<@508047998706515970>).`);
});

const editBotSchema = Joi.object().required().keys({
    shortDescription: Joi.string().max(200),
    longDescription: Joi.string().max(12000),
    prefix: Joi.string().max(50),
    invite: Joi.string().uri({scheme: ["https", "http"]}),
    website: Joi.string().uri({scheme: ["https", "http"]}),
    library: Joi.string(),
    github: Joi.string().uri({scheme: ["https"]})
});

app.patch("/bot/:id", async (req, res) => {
    const client = require("../ConstantStore").bot;
    if (Util.handleJoi(editBotSchema, req, res)) return;
    const bot = await r.table("bots").get(req.params.id).run();
    if (!bot) return res.status(404).json({error: "unknown bot"});
    if (req.user.id === bot.ownerID || req.user.admin || req.user.mod) {
        const data = Util.filterUnexpectedData(req.body, {editedAt: +new Date(), verified: false}, editBotSchema);
        if (data.library && !libList.includes(data.library)) return res.status(400).json({error: "Invalid Library"});
        if (data.github && !data.github.startsWith("https://github.com/")) return res.status(400).json({error: "Invalid Github URL"});
        const botUser = client.users.get(bot.id) || await client.users.fetch(bot.id);
        
        await r.table("bots").get(bot.id).update(data).run();
        client.channels.get("425170250548379664").send(`:thinking: <@${req.user.id}> edited ${botUser.tag} (reverify, <@508047998706516970>).`);
        res.json({ok: "edited bot"});
    } else res.status(403).json({error: "you do not own this bot"});
});

app.delete("/bot/:id", async (req, res) => {
    const bot = await r.table("bots").get(req.params.id).run();
    if (!bot) return await res.status(404).json({error: "bot does not exist"});
    if (req.user.id === bot.ownerID || req.user.admin || req.user.mod) {
        await r.table("bots").get(req.params.id).delete().run();
        res.status(200).json({ok: "Deleted bot."});
    } else res.status(403).json({error: "you do not own this bot"});
});

app.patch("/bot", async (req, res) => {
    res.sendStatus(501);
});

// bot comment resource
const newCommentSchema = Joi.object().required().keys({
    content: Joi.string().max(500).required(),
    botID: Joi.string().length(36).required()
});
const editCommentSchema = Joi.object().required().keys({
    content: Joi.string().max(500).required()
});
app.post("/bot/comment", async (req, res) => {
    if (Util.handleJoi(newCommentSchema, req, res)) return;
    return res.sendStatus(501);
    /*const data = Util.filterUnexpectedData(req.body, {authorID: req.user.id, createdAt: +new Date()}, newCommentSchema);
    
    const bot = await r.table("bots").get(data.botID).run();
    if (!bot) return res.status(404).json({error: "Bot not found"});

    const reResponse = await r.table("comments").insert(data).run();
    res.status(200).json({ok: "comment created", commentID: reResponse.generated_keys[0]});*/
});

app.patch("/bot/comment/:id", async (req, res) => {
    return res.sendStatus(501);
    /*const comment = await r.table("comments").get(req.params.id);
    if (!comment) return res.status(404).json({error: "comment not found"});
    if (comment.authorID !== req.user.id) return res.status(403).json({error: "no permission"});
    if (Util.handleJoi(editCommentSchema, req, res)) return;
    const data = Util.filterUnexpectedData(req.body, {editedAt: +new Date()}, newCommentSchema);
    await r.table("comments").get(req.params.id).update(data).run();
    res.status(200).json({ok: "comment edited"});*/
});

app.delete("/bot/comment/:id", async (req, res) => {
    return res.sendStatus(501);
    /*const comment = await r.table("comments").get(req.params.id);
    if (!comment) return res.status(404).json({error: "comment not found"});
    if (comment.authorID !== req.user.id) return res.status(403).json({error: "no permission"});
    await r.table("comments").get(req.params.id).delete().run();
    res.status(200).json({ok: "deleted comment"});*/
});

// user resource
app.post("/logout", (req, res) => {
    req.logOut();
    res.sendStatus(200);
});

app.get("/me", (req, res) => {
    res.json({id: req.user.id,
            discord: {
                username: req.user.username
            },
            warning: "this api endpoint is a legacy one and does not provide all info about the user."
        });
});

const modVerifyBotSchema = Joi.object().required().keys({
    verified: Joi.boolean().required(),
    botID: Joi.string().length(18).required()
});

app.post("/bot/mod/verify", async (req, res) => {
    const client = require("../ConstantStore").bot;
    if (!(req.user.mod || req.user.admin)) return res.status(403).json({error: "No permission"});
    if (Util.handleJoi(modVerifyBotSchema, req, res)) return;
    const data = Util.filterUnexpectedData(req.body, {}, modVerifyBotSchema);
    const bot = await Util.attachPropBot(await r.table("bots").get(data.botID).run());
    const botUser = client.users.get(bot.id) || client.users.fetch(bot.id);
    if (!bot) return res.status(404).json({error: "bot does not exist"});
    const discordOwner = client.users.get(bot.ownerID);
    const staffUser = client.users.get(req.user.id) || client.users.fetch(req.user.id);
    if (data.verified) {
        try {
            await discordOwner.send(`<:accepted:436824491470094337> Your bot, ${bot.name}, was verified by ${staffUser.tag}.`);
        } catch (e) {}
        client.channels.get("425170250548379664").send(`<:accepted:436824491470094337> ${botUser.tag} by <@${bot.ownerID}> was verified by ${staffUser}.`);
        await r.table("bots").get(bot.id).update({verified: true}).run();
    } else {
        try { 
            await discordOwner.send(`<:rejected:436824567898570763> Your bot, ${bot.name}, was rejected by ${staffUser.tag}.`);
        } catch (e) {}
        client.channels.get("425170250548379664").send(`<:rejected:436824567898570763> ${botUser.tag} by <@${bot.ownerID}> was rejected by ${staffUser}.`);
        await r.table("bots").get(bot.id).delete().run();
    }
    res.status(200).json({ok: "applied actions"});
});

app.post("/bot/:id/like", async (req, res) => {
    const bot = await r.table("bots").get(req.params.id).run();
    if (!bot) return res.status(404).json({error: "Bot does not exist"});
    let existingLike = (await r.table("likes").filter({userID: req.user.id, botID: bot.id}).run())[0];
    if (existingLike) {
        await r.table("likes").get(existingLike.id).delete().run();
        res.json({ok: "deleted like"});
    } else {
        await r.table("likes").insert({userID: req.user.id, botID: bot.id, createdAt: Date.now()}).run();
        res.json({ok: "liked bot"});
    }
});

app.use((req, res) => {
    res.sendStatus(404);
});
