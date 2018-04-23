// err reporter
var _rollbarConfig = {
    accessToken: "0086802676e540b2b2cbdcf4849bf692",
    captureUncaught: true,
    payload: {
        environment: "production"
    }
};
!function(r){function o(n){if(e[n])return e[n].exports;var t=e[n]={exports:{},id:n,loaded:!1};return r[n].call(t.exports,t,t.exports,o),t.loaded=!0,t.exports}var e={};return o.m=r,o.c=e,o.p="",o(0)}([function(r,o,e){"use strict";var n=e(1),t=e(4);_rollbarConfig=_rollbarConfig||{},_rollbarConfig.rollbarJsUrl=_rollbarConfig.rollbarJsUrl||"https://cdnjs.cloudflare.com/ajax/libs/rollbar.js/2.3.1/rollbar.min.js",_rollbarConfig.async=void 0===_rollbarConfig.async||_rollbarConfig.async;var a=n.setupShim(window,_rollbarConfig),l=t(_rollbarConfig);window.rollbar=n.Rollbar,a.loadFull(window,document,!_rollbarConfig.async,_rollbarConfig,l)},function(r,o,e){"use strict";function n(r){return function(){try{return r.apply(this,arguments)}catch(r){try{console.error("[Rollbar]: Internal error",r)}catch(r){}}}}function t(r,o){this.options=r,this._rollbarOldOnError=null;var e=s++;this.shimId=function(){return e},window&&window._rollbarShims&&(window._rollbarShims[e]={handler:o,messages:[]})}function a(r,o){var e=o.globalAlias||"Rollbar";if("object"==typeof r[e])return r[e];r._rollbarShims={},r._rollbarWrappedError=null;var t=new p(o);return n(function(){o.captureUncaught&&(t._rollbarOldOnError=r.onerror,i.captureUncaughtExceptions(r,t,!0),i.wrapGlobals(r,t,!0)),o.captureUnhandledRejections&&i.captureUnhandledRejections(r,t,!0);var n=o.autoInstrument;return(void 0===n||n===!0||"object"==typeof n&&n.network)&&r.addEventListener&&(r.addEventListener("load",t.captureLoad.bind(t)),r.addEventListener("DOMContentLoaded",t.captureDomContentLoaded.bind(t))),r[e]=t,t})()}function l(r){return n(function(){var o=this,e=Array.prototype.slice.call(arguments,0),n={shim:o,method:r,args:e,ts:new Date};window._rollbarShims[this.shimId()].messages.push(n)})}var i=e(2),s=0,d=e(3),c=function(r,o){return new t(r,o)},p=d.bind(null,c);t.prototype.loadFull=function(r,o,e,t,a){var l=function(){var o;if(void 0===r._rollbarDidLoad){o=new Error("rollbar.js did not load");for(var e,n,t,l,i=0;e=r._rollbarShims[i++];)for(e=e.messages||[];n=e.shift();)for(t=n.args||[],i=0;i<t.length;++i)if(l=t[i],"function"==typeof l){l(o);break}}"function"==typeof a&&a(o)},i=!1,s=o.createElement("script"),d=o.getElementsByTagName("script")[0],c=d.parentNode;s.crossOrigin="",s.src=t.rollbarJsUrl,e||(s.async=!0),s.onload=s.onreadystatechange=n(function(){if(!(i||this.readyState&&"loaded"!==this.readyState&&"complete"!==this.readyState)){s.onload=s.onreadystatechange=null;try{c.removeChild(s)}catch(r){}i=!0,l()}}),c.insertBefore(s,d)},t.prototype.wrap=function(r,o,e){try{var n;if(n="function"==typeof o?o:function(){return o||{}},"function"!=typeof r)return r;if(r._isWrap)return r;if(!r._rollbar_wrapped&&(r._rollbar_wrapped=function(){e&&"function"==typeof e&&e.apply(this,arguments);try{return r.apply(this,arguments)}catch(e){var o=e;throw"string"==typeof o&&(o=new String(o)),o._rollbarContext=n()||{},o._rollbarContext._wrappedSource=r.toString(),window._rollbarWrappedError=o,o}},r._rollbar_wrapped._isWrap=!0,r.hasOwnProperty))for(var t in r)r.hasOwnProperty(t)&&(r._rollbar_wrapped[t]=r[t]);return r._rollbar_wrapped}catch(o){return r}};for(var u="log,debug,info,warn,warning,error,critical,global,configure,handleUncaughtException,handleUnhandledRejection,captureDomContentLoaded,captureLoad".split(","),f=0;f<u.length;++f)t.prototype[u[f]]=l(u[f]);r.exports={setupShim:a,Rollbar:p}},function(r,o){"use strict";function e(r,o,e){if(r){var t;"function"==typeof o._rollbarOldOnError?t=o._rollbarOldOnError:r.onerror&&!r.onerror.belongsToShim&&(t=r.onerror,o._rollbarOldOnError=t);var a=function(){var e=Array.prototype.slice.call(arguments,0);n(r,o,t,e)};a.belongsToShim=e,r.onerror=a}}function n(r,o,e,n){r._rollbarWrappedError&&(n[4]||(n[4]=r._rollbarWrappedError),n[5]||(n[5]=r._rollbarWrappedError._rollbarContext),r._rollbarWrappedError=null),o.handleUncaughtException.apply(o,n),e&&e.apply(r,n)}function t(r,o,e){if(r){"function"==typeof r._rollbarURH&&r._rollbarURH.belongsToShim&&r.removeEventListener("unhandledrejection",r._rollbarURH);var n=function(r){var e=r.reason,n=r.promise,t=r.detail;!e&&t&&(e=t.reason,n=t.promise),o&&o.handleUnhandledRejection&&o.handleUnhandledRejection(e,n)};n.belongsToShim=e,r._rollbarURH=n,r.addEventListener("unhandledrejection",n)}}function a(r,o,e){if(r){var n,t,a="EventTarget,Window,Node,ApplicationCache,AudioTrackList,ChannelMergerNode,CryptoOperation,EventSource,FileReader,HTMLUnknownElement,IDBDatabase,IDBRequest,IDBTransaction,KeyOperation,MediaController,MessagePort,ModalWindow,Notification,SVGElementInstance,Screen,TextTrack,TextTrackCue,TextTrackList,WebSocket,WebSocketWorker,Worker,XMLHttpRequest,XMLHttpRequestEventTarget,XMLHttpRequestUpload".split(",");for(n=0;n<a.length;++n)t=a[n],r[t]&&r[t].prototype&&l(o,r[t].prototype,e)}}function l(r,o,e){if(o.hasOwnProperty&&o.hasOwnProperty("addEventListener")){for(var n=o.addEventListener;n._rollbarOldAdd&&n.belongsToShim;)n=n._rollbarOldAdd;var t=function(o,e,t){n.call(this,o,r.wrap(e),t)};t._rollbarOldAdd=n,t.belongsToShim=e,o.addEventListener=t;for(var a=o.removeEventListener;a._rollbarOldRemove&&a.belongsToShim;)a=a._rollbarOldRemove;var l=function(r,o,e){a.call(this,r,o&&o._rollbar_wrapped||o,e)};l._rollbarOldRemove=a,l.belongsToShim=e,o.removeEventListener=l}}r.exports={captureUncaughtExceptions:e,captureUnhandledRejections:t,wrapGlobals:a}},function(r,o){"use strict";function e(r,o){this.impl=r(o,this),this.options=o,n(e.prototype)}function n(r){for(var o=function(r){return function(){var o=Array.prototype.slice.call(arguments,0);if(this.impl[r])return this.impl[r].apply(this.impl,o)}},e="log,debug,info,warn,warning,error,critical,global,configure,handleUncaughtException,handleUnhandledRejection,_createItem,wrap,loadFull,shimId,captureDomContentLoaded,captureLoad".split(","),n=0;n<e.length;n++)r[e[n]]=o(e[n])}e.prototype._swapAndProcessMessages=function(r,o){this.impl=r(this.options);for(var e,n,t;e=o.shift();)n=e.method,t=e.args,this[n]&&"function"==typeof this[n]&&("captureDomContentLoaded"===n||"captureLoad"===n?this[n].apply(this,[t[0],e.ts]):this[n].apply(this,t));return this},r.exports=e},function(r,o){"use strict";r.exports=function(r){return function(o){if(!o&&!window._rollbarInitialized){r=r||{};for(var e,n,t=r.globalAlias||"Rollbar",a=window.rollbar,l=function(r){return new a(r)},i=0;e=window._rollbarShims[i++];)n||(n=e.handler),e.handler._swapAndProcessMessages(l,e.messages);window[t]=n,window._rollbarInitialized=!0}}}}]);
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
