const express = require("express");
const app = module.exports = express.Router();
const Joi = require("joi");
const { r } = require("../ConstantStore");
const Util = require("../Util");
app.use(async (req, res, next) => {
    const token = req.headers.authorization;
    if (!token) return res.status(400).json({error: "You need a Authorization header with a valid Bot Token."});
    const bot = (await r.table("bots").filter({apiToken: token}).run())[0];
    if (!bot) {
        res.status(403).json({error: "not_authenticated"});
    } else {
        req.bot = await Util.attachPropBot(bot);
        if (req.bot.servers == "N/A") req.bot.servers = null;
        delete req.bot._markedDescription;
        delete req.bot._discordAvatarURL;
        delete req.bot._ownerViewing;
        next();
    }
});
app.get("/", (req, res) => {
    res.json({ok: "You found the Bot API!"});
});
app.get("/me", (req, res) => {
    res.json({ok: "View data property", data: req.bot});
});

const botPostServersSchema = Joi.object().keys({
    server_count: Joi.number().max(10000000) // Just to make sure they arent super crazy.
});
app.post("/stats", async (req, res) => {
    if (Util.handleJoi(botPostServersSchema, req, res)) return;
    const { server_count } = req.body;
    await r.table("bots").get(req.bot.id).update({servers: server_count});
    res.status(200).json({ok: "updated server count"});
});

app.use((req, res) => {
    res.json({error: "Invalid Endpoint"});
});