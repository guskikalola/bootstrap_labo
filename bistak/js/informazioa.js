import Mezua from "./mezuak.js"

const PROXY = "https://guskikalola.eus/cors/";
const BASE = "aenui.org/actas";

function kargatuScript(scripts_s) {
    new Promise((res, rej) => {
        Array.from(scripts_s).filter(item => item.src).forEach((script, index, scripts) => {
            let src = script.src;
            let i = scripts.length;
            fetch(src)
                .then(r => r.text())
                .then(js => {
                    let elem = document.createElement("script");
                    elem.innerHTML = js;
                    elem.id = src;
                    document.head.appendChild(elem);
                    if (index == (i - 1)) {
                        setTimeout(() => {
                            res();
                            eval("amosarSolapa('resumen');");
                        }, 500);
                    }
                })
        });
    })
}

function izkutatu(elementua) {
	let wrapper = document.createElement("div");
	wrapper.style = "display:none;";
	elementua.parentNode.insertBefore(wrapper, elementua);
	wrapper.appendChild(elementua);
}

function estiloaEman() {
    izkutatu(document.querySelector(".botoneraSolapes"))
    document.querySelector(".ficha").classList.add("border", "my-4","mx-5", "bg-white");
    document.querySelector(".tituloFicha").classList.add("my-4","mx-5", "text-center");
    document.querySelector(".autoresFicha").classList.add("my-4","mx-5", "text-center");
    document.querySelector("#contenido_solapa_resumen").classList.add("py-3","px-2", "col-10", "mx-auto", "fs-6");
    document.querySelector(".datosCongresoFicha").classList.add("text-center", "fw-bold", "py-2", "bg-white", "text-body", "fs-3", "my-2");

}


function main(url) {
    console.log(PROXY + url)
    fetch(PROXY + url)
        .then(r => r.text())
        .then(raw_html => {

            raw_html = raw_html.replace(/(src=")/g, `src="${PROXY}${BASE}//`);
            raw_html = raw_html.replace(/(href=")/g, `href="${PROXY}${BASE}//`);

            raw_html = raw_html.replace(/(\.\.\/pdf)/g, `${PROXY}${BASE}/pdf`);
            raw_html = raw_html.replace(/(\.\.\/img)/g, `${PROXY}${BASE}/img`);


            let parser = new DOMParser();
            let html = parser.parseFromString(raw_html, "text/html");

            document.querySelector("body").innerHTML = html.body.innerHTML;

            document.head.innerHTML += `<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-Zenh87qX5JnK2Jl0vWa8Ck2rdkQ2Bzep5IDxbcnCeuOxjzrPF/et3URy9Bv1WTRi" crossorigin="anonymous">
	<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-OERcA2EqjJCMA+/3y+gxIOqMEjwtxJY7qPCqsdltbNJuaOe923+mo//f6V8Qbsw3" crossorigin="anonymous"></script>
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<link rel="stylesheet" href="css/bilatu.css">
	`;

            let scripts_s = html.querySelectorAll("script");
            let link_s = html.querySelectorAll("link");

            for (let link of link_s) {
                // if (!link.relList.contains("stylesheet"))
                    document.querySelector("head").appendChild(link)
            }

            kargatuScript(scripts_s);
            //txertatu();

            estiloaEman();
        });
}

window.addEventListener("load", () => {
    Mezua.sendMezua("LOADED", "");
    let query = new URLSearchParams(window.location.search);

    let url = query.get("url");

    if (url) main(url.replace("https://", ""));
})