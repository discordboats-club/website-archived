const express = require('express');
const app = express();
const fs = require('fs');

const r = module.exports.r = require('rethinkdbdash')({ db: 'discordboatsclub_v2' });
const jwtKey = module.exports.jwtKey = require('fs').readFileSync('jwt.key').toString();

const port = process.env.PORT || 3000;

app.use(express.json());
app.use(require('morgan')('dev'));

app.use(require('express-jwt')({ secret: jwtKey, credentialsRequired: false }), async (err, req, res, next) => {
    if (err.name == "UnauthorizedError") return res.status(403).json({error: err.message, code: err.code});
    else throw err;
    const id = parseInt(req.user, 10);
    if (!id) return next();
    const user = await r.table('users').get(id).run();
    req.user = user;
    next();
});

app.use('/api/auth', require('./routes/auth.js'));

app.listen(port, () => console.log('discordboats.club api listening on port ' + port));