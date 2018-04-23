const api = new APIClient();
console.log('Welcome to discordboats.club! Why are you looking here? :P');

console.log("%c🚫 Warning! 🚫", "color: red; font-weight: bold; font-size: x-large");
console.log("%cTyping anything here could make bad stuff happen!", "color: #e91e63; font-size: large");

function undefIfEmpty(str) {
    const res = str.trim() === "" ? undefined : str;
    return res;
}
$(window).ready(async () => {
    $(".accept-button").click((e) => {
        var card = e.target.parentElement.parentElement.parentElement.parentElement;
        var id = card.getAttribute("id");
        api.verifyBot(true, id);
        card.remove();
    });
    $(".deny-button").click((e) => {
        var card = e.target.parentElement.parentElement.parentElement.parentElement;
        var id = card.getAttribute("id");
        api.verifyBot(false, id);
        card.remove();
    });
    document.querySelectorAll(".modal").forEach(ele => M.Modal.init(ele));
    M.Dropdown.init(document.querySelector("#profile-dropdown-trigger"), {ecoverTrigger: false});

    if (document.querySelector("#searchbox")) {
        const searchBoxM = M.Autocomplete.init(document.querySelector("#searchbox"), {data: {}, limit: 10});
        document.querySelector("#searchbox").addEventListener("input", $.throttle(1000, async e => {
            const res = await fetch("/api/search/autocomplete?q="+encodeURI(e.target.value));
            const body = await res.json();
            if (!body.data) {
                M.toast("Could not get autocomplete data");
                return;
            }
            let newData = {}; 
            body.data.forEach(bot => {
                newData[bot] = null;
            });
            searchBoxM.options.data = newData;
        }));
    }

    const logoutele = document.querySelector("#log-out-indd");
    if (logoutele) document.querySelector("#log-out-indd").addEventListener("click", async e => {
        await api.logOut();
        window.localStorage.setItem("toastOnNext", "Logged out");
        if (window.location.pathname === "/") {
            window.location.reload();
        } else { 
            window.location.replace("/");
        }
    });
    if (window.localStorage.getItem("toastOnNext")) {
        M.toast({html: window.localStorage.toastOnNext});
        window.localStorage.removeItem("toastOnNext");
    }
    if (document.location.href.includes("/dashboard/new")) {
        M.FormSelect.init($("select#newbot"), {classes: "newbot-dd-wrap"});
        $("form").submit(async e => {
            e.preventDefault();
            console.log(e);
            let lib = M.FormSelect.getInstance($("select")).getSelectedValues()[0];
            if (lib === "none") lib = undefined;
            try {
                await api.createBot({
                    id: e.target[0].value,
                    library: lib,
                    prefix: e.target[3].value,
                    website: undefIfEmpty(e.target[4].value),
                    invite: e.target[5].value || `https://discordapp.com/oauth2/authorize?client_id=${encodeURI(e.target[0].value)}&scope=bot&permissions=0`,
                    shortDescription: e.target[6].value,
                    longDescription: e.target[7].value
                });
                M.toast({html: "Submitted new bot."});
                document.location.replace('/bot/' + e.target[0].value);
            } catch (error) {
                if (error.message === "ValidationError") return M.toast({html: "Invalid details."});
                M.toast({html: "An error occurred."});
                throw error;
            }
        });
    } else if (document.location.href.includes("/bot/")) {
        $("#delete-bot-action").click(async e => {
            await api.deleteBot(document.querySelector("#delete-bot-modal").getAttribute("data-bot-id"));
            window.localStorage.setItem("toastOnNext", "Deleted bot.");
            document.location.replace("/");
        });
    }

    


    // Theme control
    const controlEle = document.querySelector("#themeControl");
    let dark = localStorage.getItem("darkTheme") == "true";
    controlEle.checked = dark;
    function processThemeState() {
        if (dark) {
            $(document.body).addClass("dark-theme");
        } else {
            $(document.body).removeClass("dark-theme");
        }
    }
    processThemeState();
    controlEle.addEventListener("change", e => {
        dark = e.target.checked;
        localStorage.setItem("darkTheme", JSON.stringify(e.target.checked));
        processThemeState();
    });
});
