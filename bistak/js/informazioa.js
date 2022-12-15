import Mezua from "./mezuak.js"

const PROXY = "https://guskikalola.eus/cors/";
const BASE = "aenui.org/actas";

function amosarSolapa(codigu) {
    var iden = "solapa_" + codigu;
    document.getElementById(iden).classList.add("solapaEscoyia");
    document.getElementById(iden).classList.remove("solapaNormal");
    document.getElementById("contenido_" + iden).style.display = "block";
    // Na solapa de PDF el PDF incrustau nun se ve si nun se fai un resize.
    // Esto ye una chapuza pa forzar a que lo faiga y ca vez que se pinche na solapa cambie...
    if (codigu == "pdf") {
        var ancho = document.getElementById("contenido_" + iden).style.width;
        if (ancho == "99%")
            document.getElementById("contenido_" + iden).style.width = "98%";
        else
            document.getElementById("contenido_" + iden).style.width = "99%";
    }

    if (iden != "solapa_resumen") {
        document.getElementById("solapa_resumen").classList.add("solapaNormal");
        document.getElementById(iden).classList.remove("solapaEscoyia");

        document.getElementById("contenido_solapa_resumen").style.display = "none";
    }
    if (iden != "solapa_pdf") {
        document.getElementById("solapa_pdf").classList.add("solapaNormal");
        document.getElementById(iden).classList.remove("solapaEscoyia");

        document.getElementById("contenido_solapa_pdf").style.display = "none";
    }
    if (iden != "solapa_info") {
        document.getElementById("solapa_info").classList.add("solapaNormal");
        document.getElementById(iden).classList.remove("solapaEscoyia");

        document.getElementById("contenido_solapa_info").style.display = "none";
    }
    if (iden != "solapa_bibtex") {
        document.getElementById("solapa_bibtex").classList.add("solapaNormal");
        document.getElementById(iden).classList.remove("solapaEscoyia");

        document.getElementById("contenido_solapa_bibtex").style.display = "none";
    }
}

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
                            console.log("DONE")
                            amosarSolapa('resumen');
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
    // izkutatu(document.querySelector(".botoneraSolapes"))
    document.querySelector(".ficha").classList.add("border", "my-4", "mx-5", "bg-white");
    document.querySelector(".tituloFicha").classList.add("my-4", "mx-5", "text-center");
    document.querySelector(".autoresFicha").classList.add("my-4", "mx-5", "text-center");
    document.querySelector("#contenido_solapa_resumen").classList.add("py-3", "px-2", "col-10", "mx-auto", "fs-6");
    document.querySelector(".datosCongresoFicha").classList.add("text-center", "fw-bold", "py-2", "bg-white", "text-body", "fs-3", "my-2");

    let botoiBarra = document.createElement('div');
    botoiBarra.classList.add('botoiBarra', 'd-flex', 'justify-content-around', 'py-2', 'flex-wrap');

    // Id originala jartzen bazaie (komentatutakoak), klase bat ezartzen zaie botoie eta estiloa izorratzen du
    // BibTEX-en textua berez irudia da baina textu bezala jarri dugu


    let solapaResumen = document.createElement('button');
    solapaResumen.id = 'solapa_resumen';
    solapaResumen.onclick = function () { amosarSolapa('resumen') };
    solapaResumen.innerText = 'Laburpena';
    solapaResumen.classList.add('btn', 'btn-primary');

    let solapaInfo = document.createElement('button');
    solapaInfo.id = 'solapa_info';
    solapaInfo.onclick = function () { amosarSolapa('info') };
    solapaInfo.innerText = 'Info';
    solapaInfo.classList.add('btn', 'btn-primary');


    let solapaPDF = document.createElement('button');
    solapaPDF.id = 'solapa_pdf';
    solapaPDF.onclick = function () { amosarSolapa('pdf') };
    solapaPDF.innerText = 'PDF';
    solapaPDF.classList.add('btn', 'btn-primary');

    let solapaBibtex = document.createElement('button');
    solapaBibtex.id = 'solapa_bibtex';
    solapaBibtex.onclick = function () { amosarSolapa('bibtex') };
    solapaBibtex.innerText = 'BIBTEX';
    // solapaBibtex.style = "background: url('https://guskikalola.eus/cors/aenui.org/actas/img/logoBibTeX.png') no-repeat; background-size: 100%;"
    solapaBibtex.classList.add('btn', 'btn-primary');

    botoiBarra.appendChild(solapaResumen);
    botoiBarra.appendChild(solapaInfo);
    botoiBarra.appendChild(solapaPDF);
    botoiBarra.appendChild(solapaBibtex);

    document.querySelector('.autoresFicha').insertAdjacentElement('afterend', botoiBarra);
    //Taula originala desagertarazteko
    document.querySelector('.botoneraSolapes').style = 'display:none';
    /* let taula = document.querySelector('.botoneraSolapes');
     taula.parentNode.removeChild(taula);*/


    document.querySelector('#contenido_solapa_info').classList.add('container');
    document.querySelector('.contenidoInfo').classList.add('row');

    let contenidoInfo = document.querySelector('.contenidoInfo');
    let taula;
    let linka;
    //taula lortu
    for (const child of contenidoInfo.children) {
        if (child.tagName == 'TABLE') {

            taula = child;
            taula.parentNode.removeChild(taula);

        }
        if (child.tagName == 'A') {
            linka = child;
            linka.parentNode.removeChild(linka);
        }
    }

    let gelaxkak = taula.querySelectorAll('td');

    let divIrudia = document.createElement('div')
    divIrudia.classList.add('col-md-4', 'col-xs-12')
    let irudia = gelaxkak[0].querySelector('img');
    divIrudia.appendChild(irudia);

    let divTextua = document.createElement('div');
    divTextua.classList.add('col-md-6', 'col-xs-12','text-break');

    let textua = document.createElement('p');
    divTextua.innerHTML = gelaxkak[1].innerHTML;

    // console.log(gelaxkak[1].innerText);
    divTextua.appendChild(textua);

    document.querySelector('.contenidoInfo').appendChild(divIrudia);
    document.querySelector('.contenidoInfo').appendChild(divTextua);
    if (linka) {

        document.querySelector('.contenidoInfo').appendChild(linka);
    }

    //PDF atala
    document.querySelector('#contenido_solapa_pdf').querySelector('embed').classList.add('vh-50');

    // BITBEX atala
    document.querySelector('#contenido_solapa_bibtex').classList.add('px-2');










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
                if (!link.relList.contains("stylesheet"))
                    document.querySelector("head").appendChild(link)
            }

            //kargatuScript(scripts_s);
            //txertatu();

            estiloaEman();
            
            amosarSolapa('resumen');
        });
}

window.addEventListener("load", () => {
    Mezua.sendMezua("LOADED", "");
    let query = new URLSearchParams(window.location.search);

    let url = query.get("url");

    if (url) main(url.replace("https://", ""));
})