const APIClient = require("./APIClient");
const $ = require("jquery");
const api = new APIClient();
console.log('Welcome to discordboats.club! Why are you looking here? :P');

console.log("%c🚫 Warning! 🚫", "color: red; font-weight: bold; font-size: x-large");
console.log("%cTyping anything here could make bad stuff happen!", "color: #e91e63; font-size: large");

api.me.then(console.log).catch(console.error);

$(document).ready(function() {
    $('select').material_select();
});
