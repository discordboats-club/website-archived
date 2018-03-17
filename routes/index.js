const express = require("express");
const passport = require("passport");
const app = module.exports = express.Router();

app.get("/", (req, res) => {
    res.render("index", {user: req.user});
});

app.get("/botpage", (req, res) => {
    res.render("botPage", {});
});
