const express = require('express');
const config = require('../config.json');
const jwt = require('jsonwebtoken');
const { r, jwtKey } = require('../');
const fetch = require('node-fetch');
const router = module.exports = express.Router();
const btoa = require('btoa');

router.get('/login', (req, res) => res.redirect(`https://discordapp.com/oauth2/authorize?client_id=${config.clientID}&redirect_uri=${encodeURIComponent(config.callbackURL)}&response_type=code&scope=identify%20email`));

router.get('/callback', async (req, res) => {
    if (!req.query.code) return res.sendStatus(400);
    const creds = btoa(`${config.clientID}:${config.clientSecret}`);
    const accessResponse = await fetch(`https://discordapp.com/api/oauth2/token?grant_type=authorization_code&code=${req.query.code}&redirect_uri=${encodeURIComponent(config.callbackURL)}`, 
    {
        method: 'POST',
        headers: {
            'Authorization': `Basic ${creds}`,
            'User-Agent': 'discordboats.club/2.0 (https://discordboats.club)',
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    });
    const access = await accessResponse.json();
    if (access.error) return res.sendStatus(500);

    const userResponse = await fetch(`https://discordapp.com/api/users/@me`, 
    {
        headers: {
            'Authorization': `Bearer ${access.access_token}`,
            'User-Agent': 'discordboats.club/2.0 (https://discordboats.club)'
        }
    });
    const user = await userResponse.json();

    const avatar = user.avatar ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png` : `https://cdn.discordapp.com/embed/avatars/${user.discriminator % 5}.png`;

    if (!await r.table('users').get(user.id).run()) {
        await r.table('users').insert({
            id: user.id,
            username: user.username,
            locale: user.locale,
            avatar: avatar,
            tag: user.username + '#' + user.discriminator,
            discrim: user.discriminator,
            flags: [],

            ips: [req.cf_ip],
            email: user.email,

            discordAT: access.access_token,
            discordRT: access.refresh_token
        }).run();
    } else {
        await r.table('users').get(user.id).update({
            username: user.username,
            locale: user.locale,
            avatar: avatar,
            tag: user.username + '#' + user.discriminator,
            discrim: user.discriminator,
            
            email: user.email,

            discordAT: access.access_token,
            discordRT: access.refresh_token            
        }).run();
    }
    const jwtToken = await jwt.sign(user.id, jwtKey);
    res.send(`<script>opener.postMessage('${jwtToken}', '${config.assetURL + '/dashboard'}'); close();</script>`);
});
