const express = require('express');
const app = express();
const fs = require('fs');
const config = require('./config.json');

const r = module.exports.r = require('rethinkdbdash')({ db: 'discordboatsclub_v2', port: 28016 });
const jwtKey = module.exports.jwtKey = require('fs').readFileSync('jwt.key').toString();

const port = process.env.PORT || 3000;

const client = require('./client.js');
client.login(config.token);

app.enable('trust proxy');
app.use(require('cloudflare-express').restore()); // so we can get their real ip
app.use(express.json());
app.use(require('morgan')('dev'));

app.use(require('express-jwt')({ secret: jwtKey, credentialsRequired: false }), async (req, res, next) => {
    const id = req.user;
    if (!id) return next();
    const user = await r.table('users').get(id).run();
    req.user = user;
    next();
});

app.use('/api/auth', require('./routes/auth.js'));
app.use('/api/bots', require('./routes/bots.js'));
app.use('/api/users', require('./routes/users.js'));

app.listen(port, () => console.log('[web] listening on port ' + port));
