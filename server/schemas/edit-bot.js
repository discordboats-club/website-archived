const Joi = require('joi');

module.exports = Joi.object().required().keys({
    prefix: Joi.string().max(10),
    library: Joi.string(),
    invite: Joi.string().uri({ scheme: ['https'] }),
    website: Joi.string().uri({ scheme: ['https'] }),
    github: Joi.string().uri({ scheme: ['https'] }),
    shortDescription: Joi.string().max(2000),
    longDescription: Joi.string().max(12000)
});