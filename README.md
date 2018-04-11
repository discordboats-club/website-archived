# discordboats.club
Community maintained, open-source discord bot list.


### Self hosting the bot list for development

Please don't host this bot list publicly.

We've only tested this on Linux at the moment, feel free to make a PR editing this README file if you've found it to work on other OSes too.
* Clone the repository.
* Run `npm install` or `yarn`, this will install all dependencies and enable the git hooks.
* Setup a RethinkDB instance on your local machine, reproduce the following structure:  
\[database\]     \[table\]
`discordboatsclub.comments`

`discordboatsclub.users`

`discordboatsclub.sessions`

`discordboatsclub.bots`
* Rename the `config.json.example` to `config.json` and fill in the required fields with your Discord application details.
* Run the app, `node .`
* You may also run the webpack build watcher thing using `npx webpack -w`.
