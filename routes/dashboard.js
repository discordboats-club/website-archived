const express = require("express");
const passport = require("passport");
const app = module.exports = express.Router();

app.get("/", (req, res) => {
    res.render("dashboard/index", {user: req.user});
});

app.get("/new", (req, res) => {
    res.render("dashboard/newBot", {user: req.user});
});