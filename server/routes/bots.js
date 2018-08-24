const express = require('express');
const router = module.exports = express.Router();
const newBotSchema = require('../schemas/new-bot.js');
const randomString = require('randomstring');
const { handleJoi, libraries, filterUnexpectedData, safeBot } = require('../util.js');
const { r } = require('../');
const client = require('../client.js');
const config = require('../config.json');

router.post('/', async (req, res) => {
    if (!req.user) return res.sendStatus(401);
    if (!handleJoi(req, res, newBotSchema)) return;

    // TODO: deny blacklisted bots 

    if (req.body.github && !req.body.github.toLowerCase().startsWith('https://github.com')) return res.status(400).json({ error: 'ValidationError', details: ['Invalid Github URL'] });
    if (req.body.library && !libraries.includes(req.body.library)) return res.status(400).json({ error: 'ValidationError', details: ['Invalid library'] });

    const botUser = client.users.get(req.body.id) || await client.users.fetch(req.body.id);
    const ownerUser = await client.users.fetch(req.user.id);
    if (!ownerUser) return res.status(400).json({ error: 'ValidationError', details: ['Owner is not in discordboats discord guild'] });
    if (!botUser) return res.status(404).json({ error: 'ValidationError', details: ['Invalid bot'] });
    if (!botUser.bot) return res.status(400).json({ error: 'ValidationError', details: ['Bot must be a bot'] });

    if (await r.table('bots').get(req.body.id).run()) return res.status(409).json({ error: 'ValidationError', details: ['Bot already exists'] });

    const bot = filterUnexpectedData(req.body, 
        { 
            username: botUser.username,
            discrim: botUser.discriminator,
            tag: botUser.tag,
            avatarUrl: botUser.avatarURL(),
            views: 0,
            inviteClicks: 0,
            apiKey: randomString.generate(30),
            ownerId: req.user.id,
            createdAt: new Date(),
            featured: false,
            premium: false,
            verified: false,
            verifiedAt: null
        }, newBotSchema
    );

    await r.table('bots').insert(bot);

    const botLogChannel = client.guilds.get(config.mainGuild).channels.find(c => c.name == 'bot-log');
    const modRole = client.guilds.get(config.mainGuild).roles.find(r => r.name == 'Moderator');
    await botLogChannel.send(`📥 <@${req.user.id}> added ${botUser.tag} (<@&${modRole.id}>)`);

    res.sendStatus(200);
});

router.delete('/:id', async (req, res) => {
    if (!req.user) return res.sendStatus(401);
    if (!req.params.id) return res.sendStatus(400);
    const bot = await r.table('bots').get(req.params.id).run();
    if (!bot) return res.status(404).json({ error: 'ValidationError', details: ['Invalid bot'] });
    // TODO: allow moderators to delete bots (i need to make a permission system first)
    if (bot.ownerId !== req.user.id) return res.sendStatus(403);

    await r.table('bots').get(req.params.id).delete().run();

    const botLogChannel = client.guilds.get(config.mainGuild).channels.find(c => c.name == 'bot-log');
    await botLogChannel.send(`📤 <@${req.user.id}> deleted ${bot.tag}`);

    res.sendStatus(200);
});

router.get('/', async (req, res) => {
    const botsFromDatabase = await r.table('bots').run();
    res.json(botsFromDatabase.map(bot => safeBot(bot)));
});