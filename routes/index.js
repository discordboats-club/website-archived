const express = require("express");
const passport = require("passport");
const chunk = require("chunk");
const { r } = require("../ConstantStore");
const app = module.exports = express.Router();

app.get("/", async (req, res) => {
    const bots = await r.table("bots").sample(4 * 2).run();
    const botChunks = chunk(bots, 4); // 4 bots per 
    res.render("index", {user: req.user, rawBots: bots, botChunks});
});

app.get("/botpage", (req, res) => {
    res.render("botPage", {user: req.user});
});
