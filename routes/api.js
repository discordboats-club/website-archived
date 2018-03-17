const express = require("express");
const app = module.exports = express.Router();
const { r } = require("../app");

// datamined from the discord api docs
const libList = ["discordcr","Discord.Net","DSharpPlus","dscord","DiscordGo","Discord4j","JDA","discord.js","Eris","Discordia","RestCord","Yasmin","discord.py","disco","discordrb","discord-rs","Sword"];

app.use((req, res, next) => {
    if (req.isAuthenticated()) next();
    else {
        res.status(403).json({error: "not_authenticated"});
    }
});

app.get("/", (req, res) => {
    res.json({success: "you found the api!"});
});

app.post("/bot", async (req, res) => {
    return res.sendStatus(501);

    if (typeof req.body !== "object") return res.sendStatus(400);
    if (typeof req.body.shortDesc !== "string") return res.sendStatus(400);
    if (typeof req.body.longDesc !== "string") return res.sendStatus(400);
    if (typeof req.body.id !== "string") return res.sendStatus(400);
    if (!(await r.table("bots").get(req.body.id).run())) return res.sendStatus(304);
    // TODO: finish this endpoint
});


app.use((req, res) => {
    res.status(404).json({error: "endpoint_not_found"});
});