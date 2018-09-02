# discordboats.club API
#### Here you can find documentation on all of the approved API endpoints that you may want to use in your bot or service.

## Authorization
To authenticate with our API you must use an Authorization header containing your bot's API key.
API keys are provided on a per-bot basis. You can find your bot's API key by going to the Manage page of your bot.
Only use an Authorization header if it explicitly stated in the documentation of the route.

## Preface
- All requests must go to **`https://api.discordboats.club`**;
- All request bodies must be JSON with a `Content-Type: application/json` header. 

### GET `/api/bots`
Get a list of every bot registered on the site, regardless of whether it is verified or not.

### GET `/api/bots/:id`
Get information for the specified bot.

*more docs need to be added -daniel*