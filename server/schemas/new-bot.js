const Joi = require('joi');

module.exports = Joi.object().required().keys({
    id: Joi.string().min(10).max(26).regex(/\d./g).required(),
    prefix: Joi.string().max(10).required(),
    library: Joi.string(),
    invite: Joi.string().uri({ scheme: ['https'] }),
    website: Joi.string().uri({ scheme: ['https'] }),
    github: Joi.string().uri({ scheme: ['https'] }),
    shortDescription: Joi.string().max(150).required(),
    longDescription: Joi.string().max(12000).required()
});
