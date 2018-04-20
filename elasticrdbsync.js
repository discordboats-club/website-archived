const rdbelasticstream = require("rethinkdb-elasticsearch-stream");
rdbelasticstream.default({
    backfill: true,
    elasticsearch: { host: "127.0.0.1", port: 9200 },
    rethinkdb: { host: "localhost", port: 28015 },
    tables: [{ db: "discordboatsclub", table: "bots" }],
    watch: true
}).then(() => console.log("ElasticRDBSync is ready."));