const ratelimit = require('express-rate-limit');

exports.editBotLimiter = ratelimit({
    windowMs: 45000,
    max: 2,
    skipFailedRequests: true,
    keyGenerator: (req) => {
        return req.cf_ip;
    }
});