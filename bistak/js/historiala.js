import HistorialaKudeatzailea from "./historialaKudeatzailea.js";
import Mezua from "./mezuak.js";


const PROXY = "https://guskikalola.eus/cors/";
const BASE = "aenui.org/actas";
window.articulos = JSON.parse(localStorage.getItem("articulos"));

function kargatuHistoriala() {
    let historiala = HistorialaKudeatzailea.getInstance().getHistoriala();
    let historialaContainer = document.querySelector("#historiala");

    let aktak = [];
    let unekoAkta = document.createElement("div");
    unekoAkta.classList.add("akta")

    // Korritu emaitzen elementu bakoitza eta (titulo,autor) bikoteetan pilatu
    for (let aktaId of historiala) {

        // Sortu elementuaren edukia gordetzeko div
        let titulua = document.createElement("div");
        titulua.innerHTML = articulos[aktaId][2];
        // Elementua titulua bada gehitu klasea hori adierazteko
        titulua.classList.add("akta-titulua");
        titulua.classList.add("fs-6", "text");

        // Aktaren gainean klikatzean tituluan zegoen onclick funtzio berdina egin baino lehio berri bat irikita
        unekoAkta.addEventListener("click", () => {
            let indiz = aktaId;
            var num = "" + indiz;
            while (num.length < 4)
                num = "0" + num;
            var urlFicha = `bistak/informazioa.html?url=https://${BASE}/fichas/` + articulos[indiz][0] + "_" + articulos[indiz][1] + "_" + num + ".html";

            Mezua.sendMezua("MKWINDOW", urlFicha);
            HistorialaKudeatzailea.getInstance().gordeHistorialan(indiz);
        });

        // Sortu elementuaren edukia gordetzeko div
        let egileak = document.createElement("div");
        egileak.innerHTML = articulos[aktaId][2];
        // Elementua egileak bada gehitu klasea hori adierazteko
        egileak.classList.add("akta-egileak");
        egileak.classList.add("fs-6", "text");


        // Uneko aktari gehitu titulu eta egilea elementuak
        unekoAkta.appendChild(titulua);
        unekoAkta.appendChild(egileak);

        if (unekoAkta.childNodes.length >= 2) { // Akta titulua eta egileak ditu
            // akta bat bere titulu eta autoreekin osatu dugu, akta gorde
            aktak.push(unekoAkta);
            unekoAkta = document.createElement("div");
            unekoAkta.classList.add("akta");
        }
    }


	for (let akta of aktak) {
		historialaContainer.appendChild(akta);
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
		akta.classList.add("border", "p-2", "m-2", "text-break", "bg-primary", "border", "border-dark");
		akta.setAttribute("role", "button");
	}
}

window.addEventListener("load", () => {
    Mezua.sendMezua("LOADED", "");
    kargatuHistoriala();
    estiloaEman();
});