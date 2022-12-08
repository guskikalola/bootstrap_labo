

import Mezua from "./mezuak.js"

window.addEventListener("load", () => {
    console.log("about us")
    Mezua.sendMezua("LOADED","");
    let but = document.getElementById("aboutBistara")
    but.addEventListener("click", () => {
        console.log("Kaixo")
        Mezua.sendMezua("CHVIEW","about");
    });
});