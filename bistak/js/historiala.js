import HistorialaKudeatzailea from "./historialaKudeatzailea.js";
import Mezua from "./mezuak.js";


const PROXY = "https://guskikalola.eus/cors/";
const BASE = "aenui.org/actas";
window.articulos = JSON.parse(localStorage.getItem("articulos"));

let ezabatzeko = new Set();
let ezabatuButton = undefined;

const EZABATU_GUZTIAK = "Ezabatu guztiak";
const EZABATU_BATZUK = "Ezabatu aukeratutakoak";
const HUTSIK_DAGO = "Historiala hutsik dago. Nabigatzen duzun heinean beteko da.";

function toggleEzabatu(e,aktaId) {
    let target = e.target;
    let checked = target.checked;
    if(checked) {
        ezabatzeko.add(aktaId);
    } else {
        ezabatzeko.delete(aktaId);
    }

    if(ezabatzeko.size == 0) {
        ezabatuButton.innerText = EZABATU_GUZTIAK;
    } else {
        ezabatuButton.innerText = EZABATU_BATZUK + "(" + ezabatzeko.size + ")";
    }
}

function ezabatuHistoriala(e) {
    let targets = ezabatzeko.size > 0 ? ezabatzeko : HistorialaKudeatzailea.getInstance().getHistoriala();
    for(let aktaId of targets) {
        let aktaContainer = document.querySelector("#akta-"+aktaId);
        ezabatzeko.delete(aktaId);
        aktaContainer.remove();
        HistorialaKudeatzailea.getInstance().ezabatuHistorialatik(aktaId);
    }

    if(ezabatzeko.size == 0) {
        ezabatuButton.innerText = EZABATU_GUZTIAK;
    } else {
        ezabatuButton.innerText = EZABATU_BATZUK + "(" + ezabatzeko.size + ")";
    }

    if(document.querySelector("#historiala").childElementCount == 0) {
        historiala_hutsik();
    }
}

function historiala_hutsik() {
    let mezua = document.createElement("p");
    mezua.innerText = HUTSIK_DAGO;
    mezua.classList.add("text","fs-4");
    document.querySelector("#historiala").appendChild(mezua);
}

function kargatuHistoriala() {
    let historiala = HistorialaKudeatzailea.getInstance().getHistoriala();
    let historialaContainer = document.querySelector("#historiala");

    let aktak = [];
    let unekoAkta = document.createElement("div");
    unekoAkta.classList.add("akta")

    // Korritu emaitzen elementu bakoitza eta (titulo,autor) bikoteetan pilatu
    for (let aktaId of historiala) {

        // sortu checkbox elementua ezabatzekoa aukeratzeko
        let ezabatuCheck = document.createElement("input");
        ezabatuCheck.type = "checkbox";
        ezabatuCheck.classList.add("akta-ezabatu");

        ezabatuCheck.addEventListener("click", (e) => {toggleEzabatu(e,aktaId)});

        // Sortu elementuaren edukia gordetzeko div
        let titulua = document.createElement("div");
        titulua.innerHTML = articulos[aktaId][2];
        // Elementua titulua bada gehitu klasea hori adierazteko
        titulua.classList.add("akta-titulua");

        // Aktaren gainean klikatzean tituluan zegoen onclick funtzio berdina egin baino lehio berri bat irikita
        unekoAkta.addEventListener("click", () => {
            let indiz = aktaId;
            var num = "" + indiz;
            while (num.length < 4)
                num = "0" + num;
            var urlFicha = `informazioa?url=https://${BASE}/fichas/` + articulos[indiz][0] + "_" + articulos[indiz][1] + "_" + num + ".html";

            Mezua.sendMezua("CHVIEW", urlFicha);
            HistorialaKudeatzailea.getInstance().gordeHistorialan(indiz);
        });

        // Sortu elementuaren edukia gordetzeko div
        let egileak = document.createElement("div");
        egileak.innerHTML = articulos[aktaId][3];
        // Elementua egileak bada gehitu klasea hori adierazteko
        egileak.classList.add("akta-egileak");


        // Uneko aktari gehitu titulu eta egilea elementuak
        let container = document.createElement("div"); container.classList.add("akta-container"); container.id = "akta-"+aktaId;
        let containerEzabatu = document.createElement("div"); containerEzabatu.classList.add("akta-container-ezabatu");
        
        unekoAkta.append(titulua);
        unekoAkta.append(egileak);
        
        containerEzabatu.append(ezabatuCheck);

        container.appendChild(containerEzabatu);
        container.appendChild(unekoAkta);

        if (unekoAkta.childNodes.length >= 2) { // Akta titulua eta egileak ditu
            // akta bat bere titulu eta autoreekin osatu dugu, akta gorde
            aktak.push(container);
            unekoAkta = document.createElement("div");
            unekoAkta.classList.add("akta");
        }
    }


	for (let akta of aktak) {
		historialaContainer.appendChild(akta);
	}

    ezabatuButton = document.querySelector("#ezabatu");
    ezabatuButton.addEventListener("click", ezabatuHistoriala);
    ezabatuButton.innerText = EZABATU_GUZTIAK;

    if(aktak.length == 0) {
        historiala_hutsik();
    }

}

function estiloaEman() {
	for (let elem of document.querySelectorAll(".akta-titulua")) {
		elem.classList.add("p-2","fs-6","text"); // Eman banaketa pixka bat irakurtzeko errezago
	}
	for (let elem of document.querySelectorAll(".akta-egileak")) {
		elem.classList.add("p-2","fs-6","text"); // Eman banaketa pixka bat irakurtzeko errezago
	}
    for (let akta of document.querySelectorAll(".akta")) {
		akta.classList.add("border", "p-2", "m-2", "text-break", "bg-primary", "border", "border-dark","d-flex","align-items-center","flex-column");
		akta.setAttribute("role", "button");
	}
    for(let elem of document.querySelectorAll(".akta-container-ezabatu")) {
        elem.classList.add("m-auto","px-2");
    }
    for(let elem of document.querySelectorAll(".akta-container")) {
        elem.classList.add("d-flex","flex-row","px-2")
    }
}

window.addEventListener("load", () => {
    Mezua.sendMezua("LOADED", "");
    kargatuHistoriala();
    estiloaEman();
});