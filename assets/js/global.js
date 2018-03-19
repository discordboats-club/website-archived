const APIClient = require("./APIClient");
const $ = require("jquery");
const api = new APIClient();
console.log('Welcome to discordboats.club! Why are you looking here? :P');

console.log("%c🚫 Warning! 🚫", "color: red; font-weight: bold; font-size: x-large");
console.log("%cTyping anything here could make bad stuff happen!", "color: #e91e63; font-size: large");


$(document).ready(async () => {
    $('select').material_select();
    try {
        const me = await api.getMe();
        $("#user-proflog").html(`<i class="fas fa-user-circle"></i> ${me.username}`);
    } catch(err) {
        console.error(err);
    }
});
