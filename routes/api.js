const express = require("express");
const app = module.exports = express.Router();
const Joi = require("joi");
const { r } = require("../ConstantStore");
// datamined from the discord api docs
const libList = ["discordcr","Discord.Net","DSharpPlus","dscord","DiscordGo","Discord4j","JDA","discord.js","Eris","Discordia","RestCord","Yasmin","discord.py","disco","discordrb","discord-rs","Sword"];
app.use((req, res, next) => {
    if (req.isAuthenticated()) next();
    else {
        res.status(403).json({error: "not_authenticated"});
    }
});

app.get("/", (req, res) => {
    res.json({ok: "you found the api!"});
});

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

function handleJoi(schema, req, res) {
    const wdjt = Joi.validate(req.body, schema); // What Does Joi Think (wdjt)
    if (wdjt.error) {
        if (!wdjt.error.isJoi) {
            console.error("Error while running Joi.", wdjt.error);+new Date()
            res.status(500).json({error: "Internal Server Error"});
            return true;+new Date()
        }
        res.status(400).json({error: wdjt.error.name, details: wdjt.error.details.map(item => item.message)});
        return true;+new Date()
    }
    return false;
}

// bot resource
app.post("/bot", async (req, res) => {

    if (handleJoi(newBotSchema, req, res)) return;+new Date()

    const data = filterUnexpectedData(req.body, {ownerID: req.user.id, createdAt: +new Date(), verified: false}, newBotSchema);
    if (data.library && !data.library.includes(libList)) return res.status(400).json({error: "Invalid Library"});

    // does bot already exist?
    const dbeBot = await r.table("bots").get(data.id);
    if (dbeBot) return res.status(302).json({error: "Bot already exists"});


    // everything looks good.
    await r.table("bots").insert(data).run();
    res.status(200).json({ok: "Created bot"});
});

app.delete("/bot/:id", async (req, res) => {
    const bot = await r.table("bots").get(req.params.id).run();
    if (bot.ownerID !== req.user.id) return res.status(403).json({error: "You can't delete a bot you don't own!"});
    await r.table("bots").get(req.body.id).delete().run();
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
    if (handleJoi(newCommentSchema, req, res)) return;
    const bot = await r.table("bots").get(req.body.botID).run();
    if (!bot) return res.status(404).json({error: "Bot not found"});

    const data = filterUnexpectedData(req.body, {authorID: req.user.id, createdAt: +new Date()}, newCommentSchema);
    
    const reResponse = await r.table("comments").insert(data).run();
    res.status(200).json({ok: "comment created", commentID: reResponse.generated_keys[0]});
});

app.patch("/bot/comment/:id", async (req, res) => {
    const comment = await r.table("comments").get(req.params.id);
    if (!comment) return res.status(404).json({error: "comment not found"});
    if (comment.authorID !== req.user.id) return res.status(403).json({error: "no permission"});
    if (handleJoi(editCommentSchema, req, res)) return;
    const data = filterUnexpectedData(req.body, {editedAt: +new Date()}, newCommentSchema);
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
                username: req.user.discord.username,
                discrim: req.user.discord.discriminator
             }
        });
});

app.use((req, res) => {
    res.status(404).json({error: "endpoint_not_found"});
});