const express = require('express');
const { r } = require('../');
const { safeUser } = require('../util');
const router = module.exports = express.Router();

router.get('/user/:id', async (req, res) => {
    let id = req.params.id;
    if (id == 'me' && req.user) id = req.user.id;
    const user = await r.table('users').get(id).run();
    res.json({ user: req.params.id == 'me' ? user : safeUser(user) });
});