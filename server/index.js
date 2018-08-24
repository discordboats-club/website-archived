const express = require('express');
const app = express();
const fs = require('fs');
const config = require('./config.json');

const r = module.exports.r = require('rethinkdbdash')({ db: 'discordboatsclub_v2' });
const jwtKey = module.exports.jwtKey = require('fs').readFileSync('jwt.key').toString();

const port = process.env.PORT || 3000;

const client = require('./client.js');
client.login(config.token);

app.use(express.json());
app.use(require('morgan')('dev'));

app.use(require('express-jwt')({ secret: jwtKey, credentialsRequired: false }), async (err, req, res, next) => {
    if (err.name == 'UnauthorizedError') return res.status(403).json({ error: err.message, details: [err.code] });
    else throw err;
    const id = parseInt(req.user, 10);
    if (!id) return next();
    const user = await r.table('users').get(id).run();
    req.user = user;
    next();
});

app.use('/api/auth', require('./routes/auth.js'));
app.use('/api/bots', require('./routes/bots.js'));
app.use('/api/users', require('./routes/users.js'));

app.listen(port, () => console.log('[web] listening on port ' + port));