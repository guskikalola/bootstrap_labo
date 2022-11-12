import Mezua from "./mezuak.js"

window.addEventListener("load", () => {
    console.log("kaixo")
    Mezua.sendMezua("LOADED","");
    let but = document.getElementById("bilatuBistara")
    but.addEventListener("click", () => {
        Mezua.sendMezua("CHVIEW","bilatu");
    });
});