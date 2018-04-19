const express = require("express");
const app = module.exports = express.Router();
const Joi = require("joi");
const { r } = require("../ConstantStore");
const Util = require("../Util");
app.use((req, res, next) => {
    const token = req.headers.Authorization;
    if (!token) return res.status(400).json({error: "You need a Authorization header with a valid Bot Token."});
    const bot = (await r.table("bots").filter({apiToken: token}).run())[0];
    if (!bot) {
        res.status(403).json({error: "not_authenticated"});
    } else {
        req.bot = await Util.attachPropBot(bot);
        next();
    }
});
app.get("/", (req, res) => {
    res.json({ok: "You found the API!"});
});

app.use((req, res) => {
    res.json({error: "Invalid Endpoint"});
});