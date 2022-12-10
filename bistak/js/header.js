import Mezua from "./mezuak.js";

window.addEventListener("load", function() {
    let but = document.getElementById("aboutBistara")
    let but2 = document.getElementById("hasieraBistara")
    but.addEventListener("click", () => {
        console.log("About us bistara joan")
        Mezua.sendMezua("CHVIEW","about");
    });
    but2.addEventListener("click", () => {
        console.log("Hasierara")
        Mezua.sendMezua("CHVIEW","hasiera");
    });
});