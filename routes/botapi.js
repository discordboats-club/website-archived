const express = require("express");
const app = module.exports = express.Router();
const Joi = require("joi");
const { r } = require("../ConstantStore");
const Util = require("../Util");
app.use((req, res, next) => {
    res.status(403).json({error: "not_authenticated"});
});