const express = require("express");
const passport = require("passport");
const chunk = require("chunk");
const Util = require("../Util");
const { r } = require("../ConstantStore");
const escapeHTML = require("escape-html");
const marked = require("marked");
const app = module.exports = express.Router();

app.get("/", async (req, res) => {
    const bots = (await r.table("bots").sample(4 * 2).run()).map(Util.attachPropBot);
    const botChunks = chunk(bots, 4); // 4 bots per 
    res.render("index", {user: req.user, rawBots: bots, botChunks});
});

app.get("/bot/:id", async (req, res) => {
    const bot = Util.attachPropBot(await r.table("bots").get(req.params.id).run());
    if (!bot) return res.sendStatus(404);
    if (!bot.verified && !(req.user && req.user.id === bot.ownerID)) return res.sendStatus(404); // pretend it doesnt exist lol
    bot._markedDescription = marked(escapeHTML(bot.longDescription));
    res.render("botPage", {user: req.user, bot});
});
