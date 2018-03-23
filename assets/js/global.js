const APIClient = require("./APIClient");
const $ = require("jquery");
const M = require("materialize-css");
const api = new APIClient();
window.api = api;
console.log('Welcome to discordboats.club! Why are you looking here? :P');

console.log("%c🚫 Warning! 🚫", "color: red; font-weight: bold; font-size: x-large");
console.log("%cTyping anything here could make bad stuff happen!", "color: #e91e63; font-size: large");


$(window).ready(async () => {
    M.FormSelect.init(document.querySelector("select#newbot"), {classes: "newbot-dd-wrap"});
    if (document.location.href.includes("/dashboard/new")) {
        document.querySelector("button#nb-submit").addEventListener("click", e => {
            M.toast({html: "Submitted bot!"});
            api.createBot()
        });
    }
});