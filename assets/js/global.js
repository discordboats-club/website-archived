const APIClient = require("./APIClient");
const $ = require("jquery");
const M = require("materialize-css");
const api = new APIClient();
console.log('Welcome to discordboats.club! Why are you looking here? :P');

console.log("%c🚫 Warning! 🚫", "color: red; font-weight: bold; font-size: x-large");
console.log("%cTyping anything here could make bad stuff happen!", "color: #e91e63; font-size: large");

console.log(M);
M.AutoInit();
$(document).ready(async () => {
    $("#new-bot-form").submit(e => {
        // not implemented yet
    });
});