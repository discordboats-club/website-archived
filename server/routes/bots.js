const express = require('express');
const router = module.exports = express.Router();
const newBotSchema = require('../schemas/new-bot.js');
const editBotSchema = require('../schemas/edit-bot.js');
const randomString = require('randomstring');
const { handleJoi, libraries, filterUnexpectedData, safeBot, getBadBots } = require('../util.js');
const { editBotLimiter } = require('../ratelimits.js');
const { r } = require('../');
const client = require('../client.js');
const config = require('../config.json');

router.post('/', async (req, res) => {
    if (!req.user) return res.sendStatus(401);
    if (!handleJoi(req, res, newBotSchema)) return;

    const badBots = await getBadBots();
    if (badBots.includes(req.body.id)) return res.status(403).json({ error: 'ValidationError', details: ['This bot is blacklisted']});

    if (req.body.github && !req.body.github.toLowerCase().startsWith('https://github.com')) return res.status(400).json({ error: 'ValidationError', details: ['Invalid Github URL'] });
    if (req.body.library && !libraries.includes(req.body.library)) return res.status(400).json({ error: 'ValidationError', details: ['Invalid library'] });

    const mainGuild = client.guilds.get(config.mainGuild);

    const botUser = client.users.get(req.body.id) || await client.users.fetch(req.body.id);
    const ownerUser = await client.users.fetch(req.user.id);
    if (!mainGuild.member(ownerUser.id)) return res.status(400).json({ error: 'ValidationError', details: ['Owner is not in discordboats discord guild'] });
    if (!botUser) return res.status(404).json({ error: 'BotRetrievalError', details: ['Invalid bot'] });
    if (!botUser.bot) return res.status(400).json({ error: 'ValidationError', details: ['Bot must be a bot'] });

    if (await r.table('bots').get(req.body.id).run()) return res.status(409).json({ error: 'ValidationError', details: ['Bot already exists'] });

    req.body.invite = req.body.invite || `https://discordapp.com/oauth2/authorize?scope=bot&client_id=${botUser.id}&permissions=0`;
    
    const bot = filterUnexpectedData(req.body, 
        { 
            id: botUser.id,
            username: botUser.username,
            discrim: botUser.discriminator,
            tag: botUser.tag,
            avatarUrl: botUser.displayAvatarURL({ format: 'png' }),
            shortDesc: req.body.shortDesc,
            longDesc: req.body.longDesc,
            views: 0,
            inviteClicks: 0,
            apiKey: randomString.generate(30),
            ownerId: req.user.id,
            otherOwnersIds: req.others ? req.others.split(',').map(id => id.trim()) : [],
            botTags: req.botTags ? req.botTags.split(',').map(id => id.trim()) : [],
            createdAt: new Date(),
            featured: false,
            premium: false,
            verified: null,
            verifiedAt: null,
            verifiedBy: null,
            library: req.body.library,
            website: req.body.website ? req.body.website : null,
            github: req.body.github ? req.body.github : null
        }, newBotSchema
    );

    await r.table('bots').insert(bot);

    const botLogChannel = mainGuild.channels.find(c => c.name == 'bot-log');
    const modRole = mainGuild.roles.find(r => r.name == 'Moderator');
    await botLogChannel.send(`📥 <@${req.user.id}> added **${botUser.tag}** (<@&${modRole.id}>)`);
    await ownerUser.send(`📥 Your bot **${botUser.tag}** has been added to the queue! Please wait for a moderator to review it.`);

    res.sendStatus(201);
});

router.delete('/:id', async (req, res) => {
    if (!req.user) return res.sendStatus(401);
    if (!req.params.id) return res.sendStatus(400);
    const bot = await r.table('bots').get(req.params.id).run();
    if (!bot) return res.status(404).json({ error: 'BotRetrievalError', details: ['Invalid bot'] });
    // TODO: allow moderators to delete bots (i need to make a permission system first)
    if (bot.ownerId !== req.user.id) return res.sendStatus(403);

    await r.table('bots').get(req.params.id).delete().run();

    const botLogChannel = client.guilds.get(config.mainGuild).channels.find(c => c.name == 'bot-log');
    await botLogChannel.send(`📤 <@${req.user.id}> deleted ${bot.tag}`);

    const ownerUser = await client.users.fetch(req.user.id);
    if (ownerUser) ownerUser.send(`📤 Your bot **${bot.tag}** has been deleted by <@${req.user.id}>`);    

    res.sendStatus(200);
});

router.get('/', async (req, res) => {
    const botsFromDatabase = await r.table('bots').run();
    res.json({
        bots: botsFromDatabase.map(bot => safeBot(bot))
    });
});

router.get('/featured', async (req, res) => {
    const featuredBots = await r.table('bots').filter({ featured: true }).run();
    res.json(featuredBots.map(bot => safeBot(bot)));
});

router.get('/:id', async (req, res) => {
    const bot = await r.table('bots').get(req.params.id).run();
    if (!bot) return res.status(404).json({ error: 'BotRetrievalError', details: ['Invalid bot'] });
    res.json(safeBot(bot));
});

router.patch('/:id', editBotLimiter, async (req, res) => {
    if (!req.user) return res.sendStatus(401);
    if (!handleJoi(req, res, editBotSchema)) return;
    
    const bot = await r.table('bots').get(req.params.id).run();
    if (!bot) return res.status(404).json({ error: 'BotRetrievalError', details: ['Invalid bot'] });
    if (bot.ownerId !== req.user.id) return res.sendStatus(403);

    const data = filterUnexpectedData(req.body, { verified: false }, editBotSchema);
    
    if (req.body.github && !req.body.github.toLowerCase().startsWith('https://github.com')) return res.status(400).json({ error: 'ValidationError', details: ['Invalid Github URL'] });
    if (req.body.library && !libraries.includes(req.body.library)) return res.status(400).json({ error: 'ValidationError', details: ['Invalid library'] });

    const botUser = client.users.get(bot.id) || await client.users.fetch(bot.id);

    await r.table('bots').get(bot.id).update(data).run();
    
    const botLogChannel = client.guilds.get(config.mainGuild).channels.find(c => c.name == 'bot-log');
    const modRole = client.guilds.get(config.mainGuild).roles.find(r => r.name == 'Moderator');
    await botLogChannel.send(`📝 <@${req.user.id}> edited **${botUser.tag}** (reverify, <@&${modRole.id}>)`);

    res.sendStatus(200);
});

router.post('/:id/verify', async (req, res) => {
    if (!req.user || !req.user.flags.includes('MODERATOR')) return res.sendStatus(403);
    if (req.query.verified == null) return res.sendStatus(400);
    const bot = await r.table('bots').get(req.params.id).run();
    if (!bot) return res.status(404).json({ error: 'BotRetrievalError', details: ['Invalid bot'] });
    await r.table('bots').get(req.params.id).update({ verified: req.query.verified, verifiedAt: Date.now(), verifiedBy: req.user.id }).run();
    if (!JSON.parse(req.query.verified)) await r.table('bots').get(req.params.id).delete().run();
    const botLogChannel = client.guilds.get(config.mainGuild).channels.find(c => c.name == 'bot-log');
    await botLogChannel.send(`${JSON.parse(req.query.verified) ? '🎉' : '😦'} <@${req.user.id}> ${JSON.parse(req.query.verified) ? 'verified' : 'deleted'} **${bot.tag}** by <@${bot.ownerId}>`);    
    const ownerUser = await client.users.fetch(bot.ownerId);
    await ownerUser.send(`${JSON.parse(req.query.verified) ? '🎉' : '😦'} Your bot **${bot.tag}** has been ${JSON.parse(req.query.verified) ? 'verified' : 'deleted'}`);
    res.json({ verified: req.query.verified });
});

router.post('/:id/stats', async (req, res) => {
    if (!handleJoi(req, res, newBotSchema)) return;
    const bot = await r.table('bots').get(req.params.id).run();
    if (!bot) return res.status(404).json({ error: 'BotRetrievalError', details: ['Invalid bot'] });
    if (!req.headers.authorization) return res.sendStatus(401);
    if (bot.apiKey !== req.headers.authorization.split(' ')[1]) return res.sendStatus(403);
    await r.table('bots').get(req.params.id).update({ guildCount: req.body.guildCount });
    res.sendStatus(200);
});
