module.exports = class APIClient {
    async getMe() {
        const res = await fetch("/api/me", {
            credentials: "include",
        });
        const me = await res.json();
        if (me.error) throw new Error(me.error);
        this._me = me;
        return me;
    }
}