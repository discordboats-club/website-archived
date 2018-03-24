const express = require("express");
const passport = require("passport");
const chunk = require("chunk");
const Util = require("../Util");
const { r } = require("../ConstantStore");
const app = module.exports = express.Router();

app.get("/", async (req, res) => {
    const bots = (await r.table("bots").filter({verified: true}).sample(4 * 2).run()).map(bot => Util.attachPropBot(bot, req.user));
    const botChunks = chunk(bots, 4); // 4 bots per 
    res.render("index", {user: req.user, rawBots: bots, botChunks});
});

app.get("/bot/:id", async (req, res) => {
    const rB = await r.table("bots").get(req.params.id).run();
    if (!rB) return res.sendStatus(404);
    const bot = Util.attachPropBot(rB, req.user);
    if (!bot.verified && !(req.user && req.user.id === bot.ownerID)) return res.sendStatus(404); // pretend it doesnt exist lol
    res.render("botPage", {user: req.user, bot});
});
