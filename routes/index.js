const express = require("express");
const chunk = require("chunk");
const ejs = require("ejs");
const webshot = require("webshot");
const Util = require("../Util");
const { r } = require("../ConstantStore");
const config = require('../config.json');
const app = module.exports = express.Router();

app.get("/", async (req, res) => {
    const bots = await Promise.all((await r.table("bots").filter({verified: true}).orderBy(r.desc("servers")).limit(13 * 2).run()).map(bot => Util.attachPropBot(bot, req.user)));
    const botChunks = chunk(bots, 4); // 4 bots per 
    res.render("index", {user: req.user, rawBots: bots, botChunks});
});

app.get("/bot/:id", async (req, res, next) => {
    const rB = await r.table("bots").get(req.params.id).run();
    if (!rB) return next();
    const bot = await Util.attachPropBot(rB, req.user);
    if (!bot.verified && !((req.user ? (req.user.mod || req.user.admin) : false) || req.user.id === rB.ownerID)) return res.sendStatus(404); // pretend it doesnt exist lol
    res.render("botPage", {user: req.user, bot});
    await r.table("bots").get(req.params.id).update({pageViews: r.row("pageViews").add(1)}).run();
});

app.get("/bot/:id/key", async (req, res, next) => {
    const rB = await r.table("bots").get(req.params.id).run();
    if (!rB) return next();
    const bot = await Util.attachPropBot(rB, req.user);
    if (bot.verified) {
        if (req.user) {
            if (req.user.id !== bot.ownerID) res.sendStatus(403);
            else return res.render("botKey", {bot: rB});
        } else return res.sendStatus(401);
    } else return res.sendStatus(403);
});

app.get("/user/:id", async (req, res, next) => {
    let user = await r.table("users").get(req.params.id).run();
    if (!user) return next();
    user = await Util.attachPropUser(user);
    res.render("userPage", {user: req.user, profile: user});
});

app.get("/search", async (req, res) => {
    if (typeof req.query.q !== "string") return res.status(403).json({error: "expected query q"});
    const text = req.query.q.toLowerCase();
    const bots = await Promise.all((await r.table("bots").filter(bot => {
        return bot("name").downcase().match(text).and(bot("verified"))
    }).orderBy(bot => {
        return bot("name").downcase().split(text).count()
    }).limit(2*4).run()).map(bot => Util.attachPropBot(bot, req.user)));

    const botChunks = chunk(bots, 4);
    res.render("search", {bots, botChunks, user: req.user, searchQuery: text});
});

app.get("/invite_url/:id", async (req, res) => {
    const bot = await r.table("bots").get(req.params.id).run();
    if (!bot) return res.status(404).json({error: "bot does not exist"});
    res.redirect(bot.verified ? bot.invite : `https://discordapp.com/api/oauth2/authorize&redirect_uri=https%3A%2F%2Fdiscordboats.club%2Fbot%2F%24%7Bbot.id%7D&scope=bot&client_id=${bot.id}&guild_id=${config.ids.verificationServer}`);

    await r.table("bots").get(bot.id).update({inviteClicks: r.row("inviteClicks").add(1)}).run();
});

app.get("/bot/:id/widget.png", async (req, res) => {
    const client = require("../ConstantStore").bot;
    const bot = await Util.attachPropBot(await r.table("bots").get(req.params.id).run());
    if (!bot) return res.status(404).json({error: "bot does not exist"});
    bot.ownerTag = (client.users.get(bot.ownerID) || client.users.fetch(bot.ownerID) || {}).tag;
    res.set("Content-Type", "image/png");
    ejs.renderFile("views/botWidget.ejs", {bot},  (err, html) => {
        if (err) throw err;
        webshot(html, undefined, {siteType: "html", windowSize: {width:"400", height: "250"}}).pipe(res);
    });
});

app.get("/terms", (req, res) => {
    res.render("terms");
});

app.get("/privacy", (req, res) => {
    res.render("privacy");
});

app.get("/stats", async (req, res) => {
    res.render("stats", {
        botCount: await r.table("bots").count().run(),
        userCount: await r.table("users").count().run(),
        likeCount: await r.table("likes").count().run(),
        botsInvited: await r.table("bots").sum("inviteClicks").run(),
        user: req.user
    });
});
