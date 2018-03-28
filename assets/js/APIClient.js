module.exports = class APIClient {
    async logOut() {
        await fetch("/api/logout", {credentials: "same-origin", method: "POST"});
    }
    /**
     * @param {Object} bot 
     * @returns {Promise<Object>} this object has a `ok` property for data from the api (usually the same for all requests)
     */
    async createBot(bot) {
        // id, shortDescription, longDescription, invite, website, library
        const res = await fetch("/api/bot", { method: "POST",
        body: JSON.stringify(bot),
        headers: {
            "Content-Type": "application/json"
        },
        credentials: "same-origin"
        });
        const data = await res.json();
        if (data.error) {
            throw new Error(data.error);
        } else if (data.ok) {
            return {ok: data.ok};
        } else {
            throw new Error("Bad response");
        }
    }
    /**
     * Deletes a boat. (Good thing comments get removed in production builds lmao)
     * @param {String} id
     * @returns {Promise<Object>} json response from the api.
     */
    async deleteBot(id) {
        const res = await fetch("/api/bot/"+encodeURI(id), { method: "DELETE", credentials: "same-origin" });
        const data = await res.json();
        if (data.error) {
            throw new Error(data.error);
        } else if (data.ok) {
            return {ok: data.ok};
        } else {
            throw new Error("Bad response");
        }
    }
}