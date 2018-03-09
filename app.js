const express = require("express");
const session = require("express-session");
const passport = require("passport");
const Discord = require("passport-discord");
const {ensureLoggedIn, ensureLoggedOut} = require("connect-ensure-login");
const compress = require("compression");
const minify = require("express-minify");
const config = require("./config");
const RethinkStore = require("session-rethinkdb")(session);
const port = process.env.port || 4000;

const secret = require("./getSecret")();
const app = module.exports = express();
const r = module.exports.r = require("rethinkdbdash")({db: "discordboatsclub"});

app.disable("x-powered-by");
app.set("view engine", "ejs");

app.use(compress());
app.use(minify());
app.use(express.static("static"));
app.use(express.json());
app.use(session({saveUninitialized: true, resave: false, name: "discordboats_session", secret, store: new RethinkStore(r)}));
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => done(undefined, user));
passport.deserializeUser((user, done) => done(undefined, user));

const discordScopes = module.exports.discordScopes = ["identify"];
passport.use(new Discord({
    clientID: config.clientID,
    clientSecret: config.clientSecret,
    scope: discordScopes
}, (accessToken, refreshToken, profile, done) => {
    // we'll enable storing extra user data here.
    done(undefined, profile);
}));

app.use(require("./routes/index"));
app.use("/discord", require("./routes/discord"));
app.use("/dashboard", ensureLoggedIn("/discord/login"), require("./routes/dashboard"));

app.listen(port, () => console.log(`Listening on port ${port}.`))