const Joi = require('joi');

module.exports = Joi.object().required().keys({
    guildCount: Joi.number().positive().required()
    /* TODO: sharding support */
});