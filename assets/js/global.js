const APIClient = require("./APIClient");
const $ = require("jquery");
const M = require("materialize-css");
const api = new APIClient();
console.log('Welcome to discordboats.club! Why are you looking here? :P');

console.log("%c🚫 Warning! 🚫", "color: red; font-weight: bold; font-size: x-large");
console.log("%cTyping anything here could make bad stuff happen!", "color: #e91e63; font-size: large");


$(window).ready(async () => {
    if (document.location.href.includes("/dashboard/new")) {
        M.FormSelect.init($("select#newbot"), {classes: "newbot-dd-wrap"});
        $("form").submit(async e => {
            e.preventDefault();
            let lib = M.FormSelect.getInstance($("select")).getSelectedValues()[0];
            if (lib === "none") lib = undefined;
            console.log(e);
            try { 
                await api.createBot({
                    name: e.target[0].value,
                    id: e.target[1].value,
                    library: lib,
                    prefix: e.target[4].value,
                    website: e.target[5].value,
                    invite: e.target[6].value || `https://discordapp.com/oauth2/authorize?client_id=${encodeURI(e.target[1].value)}&scope=bot&permissions=0`,
                    shortDescription: e.target[7].value,
                    longDescription: e.target[8].value
                });
                M.toast({html: "Submitted bot!"});
            } catch (error) {
                if (error.message === "ValidationError") return M.toast({html: "Invalid details!"});
                M.toast({html: "Error while submitting bot!"});
                throw error;
            }
        });
    }
});