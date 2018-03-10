const express = require("express");
const session = require("express-session");
const passport = require("passport");
const Discord = require("passport-discord");
const {ensureLoggedIn, ensureLoggedOut} = require("connect-ensure-login");
const compress = require("compression");
const request = require("snekfetch");
const config = require("./config");
const minifyHTML = require("express-minify-html");
const RethinkStore = require("session-rethinkdb")(session);
const port = process.env.port || require("./config.json").listeningPort || 3000;

const secret = require("./getSecret")();
const app = module.exports = express();
const r = module.exports.r = require("rethinkdbdash")({db: "discordboatsclub"});

app.disable("x-powered-by");
app.set("view engine", "ejs");

app.use(compress());
app.use(minifyHTML({
    override: true,
    exception_url: false,
    htmlMinifier: {
        removeComments: true,
        collapseWhitespace: true,
        collapseBooleanAttributes: true,
        removeAttributeQuotes: true,
        removeEmptyAttributes: true,
        minifyJS: true
    }
}));
app.use(express.static("static"));
app.use(express.json());
app.use(session({saveUninitialized: true, resave: false, name: "discordboats_session", secret, store: new RethinkStore(r)}));
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => done(undefined, user.id));
passport.deserializeUser(async (id, done) => {
    const user = await r.table("users").get(id).run();
    if (!user) return done();
    // yay!
    const res = await request.get(
        "https://discordapp.com/api/users/@me")
        .set("Authorization", `Bearer ${user.discordAT}`)
        .set("User-Agent", "discordboats.club (https://discordboats.club, 1.0.0) Manual API Request")
        .send();
    user.discord = res.body;
    delete user.discordAT;
    
    done(undefined, user);
});

const discordScopes = module.exports.discordScopes = ["identify"];
passport.use(new Discord({
    clientID: config.clientID,
    clientSecret: config.clientSecret,
    scope: discordScopes,
    callbackURL: config.callbackURL
}, async (accessToken, refreshToken, profile, done) => {
    // we'll enable storing extra user data here.
    await r.table("users").insert({id: profile.id, discordAT: accessToken}, {conflict: "update"}).run();
    done(undefined, profile);
}));

app.use(require("./routes/index"));
app.use("/discord", require("./routes/discord"));
app.use("/dashboard", ensureLoggedIn("/discord/login"), require("./routes/dashboard"));

app.listen(port, () => console.log(`Listening on port ${port}.`))