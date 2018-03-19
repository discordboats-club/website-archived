module.exports = class APIClient {
    constructor() {
        this._me = undefined;
    }
    /**
     * @api private
     */
    async getSelf() {
        const res = await fetch("/api/me", {
            credentials: "include",
        });
        const me = await res.json();
        if (me.error) throw new Error(me.error);
        this._me = me;
        return me;
    }
    /**
     * Gets the current user from the API. May need to catch a error.
     * @returns {Promise<Object>}
     */
    get me() {
        if (this._me) return Promise.resolve(this._me);
        else return this.getSelf();
    }
}