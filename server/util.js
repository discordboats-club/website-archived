const Joi = require('joi');
const fetch = require('node-fetch');

let badbots;

exports.getBadBots = async () => {
    if (!badbots) {
        const res = await fetch('https://i.ronthecookie.me/badbots.txt');
        const text = await res.text();
        badbots = await text.split('\n').map(e => e.split(' ')[0]);
        return badbots;
    } else {
        return badbots;
    }
}

exports.handleJoi = (req, res, schema) => {
    const result = Joi.validate(req.body, schema);
    if (result.error) {
        if (!result.error.isJoi) {
            console.error(`Error while running Joi at ${Date.now()}: ${result.error}`);
            res.sendStatus(500);
            return false;
        }
        res.status(400).json({ error: result.error.name, details: result.error.details.map(item => item.message) });
        return false;
    } else return true;
}

exports.libraries = ['discordcr', 'Discord.Net', 'DSharpPlus', 'dscord', 'DiscordGo', 'Discord4j', 'JDA', 'discord.js', 'Eris', 'Discordia', 'RestCord', 'Yasmin', 'discord.py', 'disco', 'discordrb', 'discord-rs', 'Sword'];

exports.filterUnexpectedData = (subject, stuffToAdd, schema) => {
    const data = Object.assign({}, stuffToAdd);
    Object.keys(schema.describe().children).forEach(key => {
        data[key] = subject[key];
    });
    return data;
}

exports.safeUser = (user) => {
    delete user.discordAT;
    delete user.discordRT;
    delete user.ips;
    delete user.email;
    return user;
}

exports.safeBot = (bot) => {
    delete bot.apiKey;
    return bot;
}