const express = require('express');
const { r } = require('../');
const { safeUser } = require('../util');
const router = module.exports = express.Router();

router.get('/:id', async (req, res) => {
    let id = req.params.id;
    if (id == '@me' && req.user) id = req.user.id;
    const user = await r.table('users').get(id).run();
    res.json(safeUser(user));
});

router.delete('/@me', async (req, res) => {
    if (!req.user) return res.sendStatus(401);
    const ownedBots = await r.table('bots').filter({ ownerId: req.user.id }); 
    ownedBots.forEach(async bot => {
        await r.table('bots').delete(bot.id).run();
    });
    await r.table('users').delete(req.user.id).run();
    res.sendStatus(200);
});