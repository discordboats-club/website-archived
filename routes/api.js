const express = require("express");
const app = module.exports = express.Router();
const { r } = require("../app");

app.use((req, res, next) => {
    if (typeof req.body !== "object" || typeof req.body.token !== "string") return res.status(400).json({error: "expected body to have a token property."});
    // do token check here, later.
    res.status(403).json({error: "Unauthorized"});
});

