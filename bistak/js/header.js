import Mezua from "./mezuak.js";

window.addEventListener("load", function() {
    let but = document.getElementById("aboutBistara")
    let but2 = document.getElementById("bilatuBistara")
    let but3 = this.document.getElementById("historialaBistara");
    but.addEventListener("click", () => {
        console.log("About us bistara joan")
        Mezua.sendMezua("CHVIEW","about");
    });
    but2.addEventListener("click", () => {
        console.log("Bilatu")
        Mezua.sendMezua("CHVIEW","bilatu");
    });
    but3.addEventListener("click", () => {
        console.log("Historiala")
        Mezua.sendMezua("CHVIEW","historiala");
    });
});