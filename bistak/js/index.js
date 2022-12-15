import Mezua from "./mezuak.js";
import bistak from "./bistak.js";

const URTE_BAT = 31557600000;

/**
 * @type {HTMLIFrameElement}
 */
let webgunea;

function main() {
    let bista = window.location.hash || "hasiera";
    webgunea = document.getElementById("webgunea");
    webgunea.id = "webgunea";
    aldatuBista(bista.replace("#", ""));
    
    let azkenAldaketa = new Date(localStorage.getItem("lastUpdate"));
    let diff = Date.now() - azkenAldaketa.getTime();
    if ( diff >= URTE_BAT ) {
        eguneratuDatuak();
    }
}

function aldatuBista(bista) {
    if (!Object.keys(bistak).includes(bista)) {
        console.error("Bista hori ez da exisitzen.", bista);
    } else {
        let url = "bistak/" + bistak[bista];
        console.log("Aldatzen bista.", url);
        webgunea.src = url;
    }
}

function webguneaKargatuta(data) {
    console.log("title", webgunea.contentDocument.title)
    document.title = webgunea.contentDocument.title;
}

function eguneratuDatuak() {
    localStorage.setItem("articulos", JSON.stringify(articulos));
    localStorage.setItem("lastUpdate", Date.now());
    localStorage.setItem("ediciones", JSON.stringify(ediciones));
}

window.addEventListener("load", main);

// webgune iframe-tik mezu bat jasotzean kudeatu
window.addEventListener("message", function (e) {
    if (!window.location.href.startsWith(e.origin))
        return;
    let mezua = Mezua.parse(e.data);
    if (mezua) {
        switch (mezua.opcode) {
            case "CHVIEW":
                window.location.hash = mezua.data;
                break;
            case "LOADED":
                webguneaKargatuta(mezua.data);
                break;
            case "MKWINDOW":
                let params = `scrollbars=no,resizable=no,status=no,location=no,toolbar=no,menubar=no,width=0,height=0,left=-1000,top=-1000`
                window.open(mezua.data, "", params);
                break;
            default:
                console.error("Espero ez zen mezua jasota", mezua.toString());
        }
    } else {
        console.error("Mezua ez den zerbait jasota", e.data);
    }
});

$(window).on('hashchange', function () {
    let hash = window.location.hash || "hasiera";
    aldatuBista(hash.replace("#", ""));
});

