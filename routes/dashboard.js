const express = require("express");
const passport = require("passport");
const chunk = require("chunk");
const app = module.exports = express.Router();
const r = require("../ConstantStore").r;
const Util = require("../Util");

app.get("/", async (req, res) => {
    const myBots = await Promise.all((await r.table("bots").filter({ownerID: req.user.id}).run()).map(Util.attachPropBot));
    const botChunks = chunk(myBots, 4);
    res.render("dashboard/index", {user: req.user, myBots: botChunks, rawBots: myBots});
});

app.get("/new", (req, res) => {
    res.render("dashboard/newBot", {user: req.user, libs: require("./api").libList});
});