module.exports = {
  apps : [{
    name: "DBU",
    script: "./app.js",
    watch: true,
	ignore_watch: "node_modules rethinkdb-2.3.6",
  }]
}