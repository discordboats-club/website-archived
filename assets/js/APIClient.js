module.exports = class APIClient {
    async getMe() {
        if (this._me) return this._me;
        const res = await fetch("/api/me", {
            credentials: "include",
        });
        const me = await res.json();
        if (me.error) throw new Error(me.error);
        this._me = me;
        return me;
    }
    async logOut() {
        await fetch("/api/logout", {credentials: "include", method: "POST"});
    }
    /**
     * @param {Object} bot 
     * @returns {Promise<Object>} this object has a `ok` property for data from the api (usually the same for all requests)
     * @throws promise rejects with object that has a `error` property, sometimes error objects may have a `details` property.
     */
    async createBot(bot) {
        // id, shortDescription, longDescription, invite, website, library
        const res = await fetch("/api/bot", { method: "POST",
        body: JSON.stringify(bot),
        headers: {
            "Content-Type": "application/json"
        },
        credentials: "include"
        });
        const data = await res.json();
        if (data.error) {
            throw new Error({error: data.error, details: data.details/* does not always exist*/});
        } else if (data.ok) {
            return {ok: data.ok};
        } else {
            throw new Error("Bad response");
        }
    }
}