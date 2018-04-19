const express = require("express");
const app = module.exports = express.Router();
const Joi = require("joi");
const { r } = require("../ConstantStore");
const randomString = require("randomstring");
const Util = require("../Util");
// datamined from the discord api docs
const libList = module.exports.libList = ["discordcr","Discord.Net","DSharpPlus","dscord","DiscordGo","Discord4j","JDA","discord.js","Eris","Discordia","RestCord","Yasmin","discord.py","disco","discordrb","discord-rs","Sword"];


app.use((req, res, next) => {
    if (req.isAuthenticated()) next();
    else {
        res.status(401).json({error: "not_authenticated"});
    }
});

app.get("/", (req, res) => {
    res.json({ok: "you found the api!"});
});


const newBotSchema = Joi.object().keys({
    shortDescription: Joi.string().max(200).required(),
    id: Joi.string().length(18).required(),
    longDescription: Joi.string().max(1500).required(),
    prefix: Joi.string().max(50).required(),
    invite: Joi.string().uri({scheme: ["https", "http"]}).required(),
    website: Joi.string().uri({scheme: ["https", "http"]}),
    library: Joi.string()
});


// bot resource
app.post("/bot", async (req, res) => {
    const client = require("../ConstantStore").bot;
    if (Util.handleJoi(newBotSchema, req, res)) return;+new Date()
    const data = Util.filterUnexpectedData(req.body, {apiToken: randomString.generate(30), ownerID: req.user.id, createdAt: +new Date(), verified: false, verificationQueue: true}, newBotSchema);
    if (data.library && !libList.includes(data.library)) return res.status(400).json({error: "Invalid Library"});

    const botUser = client.users.get(data.id) || await client.users.fetch(data.id);
    if (!botUser) return res.status(404).json({error: "Invalid Bot ID"});
    if (!botUser.bot) return res.status(400).json({error: "bot can only be a bot"});
    data.name = botUser.username;

    // does bot already exist?
    const dbeBot = await r.table("bots").get(data.id).run();
    if (dbeBot) return res.status(302).json({error: "Bot already exists"});


    // everything looks good.
    await r.table("bots").insert(data).run();
    res.status(200).json({ok: "Created bot"});
    client.channels.get("425170250548379664").send(`:thumbsup: \`${req.user.username}\` added \`${botUser.tag}\`.`);
});

app.delete("/bot/:id", async (req, res) => {
    const bot = await r.table("bots").get(req.params.id).run();
    if (!bot) return await res.status(404).json({error: "bot does not exist"});
    if (bot.ownerID !== req.user.id) return res.status(403).json({error: "You can't delete a bot you don't own!"});
    await r.table("bots").get(req.params.id).delete().run();
    res.status(200).json({ok: "Deleted bot."});
});

app.patch("/bot", async (req, res) => {
    res.sendStatus(501);
});

// bot comment resource
const newCommentSchema = Joi.object().keys({
    content: Joi.string().max(500).required(),
    botID: Joi.string().length(36).required()
});
const editCommentSchema = Joi.object().keys({
    content: Joi.string().max(500).required()
});
app.post("/bot/comment", async (req, res) => {
    if (Util.handleJoi(newCommentSchema, req, res)) return;
    res.sendStatus(501);
    const data = Util.filterUnexpectedData(req.body, {authorID: req.user.id, createdAt: +new Date()}, newCommentSchema);
    
    const bot = await r.table("bots").get(data.botID).run();
    if (!bot) return res.status(404).json({error: "Bot not found"});

    const reResponse = await r.table("comments").insert(data).run();
    res.status(200).json({ok: "comment created", commentID: reResponse.generated_keys[0]});
});

app.patch("/bot/comment/:id", async (req, res) => {
    res.sendStatus(501);
    const comment = await r.table("comments").get(req.params.id);
    if (!comment) return res.status(404).json({error: "comment not found"});
    if (comment.authorID !== req.user.id) return res.status(403).json({error: "no permission"});
    if (Util.handleJoi(editCommentSchema, req, res)) return;
    const data = Util.filterUnexpectedData(req.body, {editedAt: +new Date()}, newCommentSchema);
    await r.table("comments").get(req.params.id).update(data).run();
    res.status(200).json({ok: "comment edited"});
});

app.delete("/bot/comment/:id", async (req, res) => {
    const comment = await r.table("comments").get(req.params.id);
    if (!comment) return res.status(404).json({error: "comment not found"});
    if (comment.authorID !== req.user.id) return res.status(403).json({error: "no permission"});
    await r.table("comments").get(req.params.id).delete().run();
    res.status(200).json({ok: "deleted comment"});
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
             }
        });
});

const modVerifyBotSchema = Joi.object().keys({
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
        await discordOwner.send(`:tada: Your bot \`${bot.name}\` was verified by \`${staffUser.tag}\`.`);
        client.channels.get("425170250548379664").send(`:thumbsup: \`${req.user.username}\` verified \`${botUser.tag}\` by \`${client.users.get(bot.ownerID).tag || client.users.fetch(bot.ownerID).tag || "UNKNOWN"}\`.`);
        bot.verified = true;
        bot.verificationQueue = false;
    } else {
        await discordOwner.send(`): Your bot \`${bot.name}\` was rejected by \`${staffUser.tag}\`.`);
        client.channels.get("425170250548379664").send(`:thumbsdown: \`${req.user.username}\` rejected \`${botUser.tag}\` by \`${client.users.get(bot.ownerID).tag || client.users.fetch(bot.ownerID).tag || "UNKNOWN"}\`.`);
        bot.verificationQueue = false; // we dont wanna keep them in the queue if they've been denied - though they will be able to trigger a resubmit to the queue.
    }
    await r.table("bots").get(bot.id).update(bot).run();
    res.status(200).json({ok: "applied actions"});
});

app.use((req, res) => {
    res.sendStatus(404);
});