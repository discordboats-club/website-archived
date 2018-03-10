const express = require("express");
const app = module.exports = express.Router();

app.get("/", (req, res) => {
    res.render("botPage", {});
});
