const express = require("express");
const app = module.exports = express.Router();
const { r } = require("../app");
const { buildSchema } = require("graphql");
const graphQLHttp = require("express-graphql");

const schema = buildSchema(`
    type Query {
        hello: String
    }
`);

const root = {
    hello: () => "Nice you know how to use GraphQL"
}

app.use(graphQLHttp({
    schema,
    rootValue: root,
    graphiql: process.env.NODE_ENV !== "production"
}));