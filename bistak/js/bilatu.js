import Mezua from "./mezuak.js";

const PROXY = "https://guskikalola.eus/cors/";
const EDICIONES_U = "https://aenui.org/actas/js/ediciones.js";
const ARTICULOS_U = "https://aenui.org/actas/js/articulos.js";
const RESUMENES_U = "https://aenui.org/actas/js/resumenes.js";
const BASE = "aenui.org/actas";
const WEBGUNEA_U = "/indice_i.html"

function kargatuScript(scripts_s) {
	new Promise((res, rej) => {
		let i = scripts_s.length;
		scripts_s.forEach((script, index) => {
			let src = script.src;
			fetch(src)
				.then(r => r.text())
				.then(js => {
					js = js.replace(/(js\/)/g, `${PROXY}${BASE}/js/`);
					js = js.replace(/(img\/)/g, `${PROXY}${BASE}/img/`);
					js = js.replace(/(pdf\/)/g, `${PROXY}${BASE}/pdf/`);
					js = js.replace(/(fichas\/)/g, `${PROXY}${BASE}/fichas/`);
					let elem = document.createElement("script");
					elem.innerHTML = js;
					elem.id = src;
					document.head.appendChild(elem);
					if (index == (i - 1)) {
						setTimeout(() => {
							res();
							eval("inicializar()");
						}, 500);
					}
				})
		});
	})
}

function emaitzaBerriakKudeatu(emaitzenLista, emaitzenContainer) {
	// emaitzenContainer guk sortutako div-a da, emaitzak gordetzeko
	// emaitzenLista bilaketa egitean agertzen den div(id:llistaResultaos) da

	// emaitzen lista hutsik jarri
	emaitzenContainer.innerHTML = "";

	let aktak = [];
	let unekoAkta = document.createElement("div");
	unekoAkta.classList.add("akta")
	// Korritu emaitzen elementu bakoitza eta (titulo,autor) bikoteetan pilatu
	for (let child of emaitzenLista.childNodes) {
		// Soilik hartu titulu eta egileak
		if (child.classList.contains("tituluPonencia") || child.classList.contains("autores")) {

			// Sortu elementuaren edukia gordetzeko div
			let elem = document.createElement("div");
			elem.innerHTML = child.innerHTML;

			// Uneko aktari gehitu elementua
			unekoAkta.appendChild(elem);

			if (child.classList.contains("tituluPonencia")) {
				// Elementua titulua bada gehitu klasea hori adierazteko
				elem.classList.add("akta-titulua");
				elem.innerText = child.innerText.replace(/(\[PDF\])/g, ""); // Ezabatu [PDF]

				// Aktaren gainean klikatzean tituluan zegoen onclick funtzio berdina egin baino lehio berri bat irikita
				unekoAkta.addEventListener("click", () => {
					let indiz = child.attributes["onclick"].nodeValue.replace("amosarFicha(", "").replace(")", "");
					var num = "" + indiz;
					while (num.length < 4)
						num = "0" + num;
					var urlFicha = `bistak/informazioa.html?url=https://${BASE}/fichas/` + articulos[indiz][0] + "_" + articulos[indiz][1] + "_" + num + ".html";

					Mezua.sendMezua("MKWINDOW", urlFicha);
				});
			} else {
				// Elementua egileak bada gehitu klasea hori adierazteko
				elem.classList.add("akta-egileak");
			}
		}
		if (unekoAkta.childNodes.length >= 2) {
			// akta bat bere titulu eta autoreekin osatu dugu, akta gorde
			aktak.push(unekoAkta);
			unekoAkta = document.createElement("div");
			unekoAkta.classList.add("akta");
		}
	}

	for (let akta of aktak) {
		emaitzenContainer.appendChild(akta);
	}

	estiloaEman();

}

function izkutatu(elementua) {
	let wrapper = document.createElement("div");
	wrapper.style = "display:none;";
	elementua.parentNode.insertBefore(wrapper, elementua);
	wrapper.appendChild(elementua);
}

function txertatu() {
	/* EDIZIOAK */
	// Edizioen lista
	let edizioak = document.querySelector("#botonesEdiciones").childNodes;

	// Izkutatu edizioak
	izkutatu(document.querySelector("#botonesEdiciones"));
	izkutatu(document.querySelector(".botonEdiciones"));

	/* EMAITZAK */
	// Emaitzak kudeatu
	let emaitzenLista = document.querySelector("#resultaos");
	// Emaitzen lista izkutatu
	izkutatu(emaitzenLista);
	// Emaitzen lista berria sortu
	let emaitzenListaBerria = document.createElement("div");
	emaitzenListaBerria.id = "emaitzenLista";
	// Emaitza berriak gehitzen direnean detektatu
	let observerConfig = { attributes: false, childList: true, subtree: false };
	let observer = new MutationObserver((mutationList, observer) => {
		for (const mutation of mutationList) {
			if (mutation.type === 'childList') { // elementu bat gehitu edo ezabatu da
				if (mutation.addedNodes.length > 0) {
					let emaitzenDiv = mutation.addedNodes.item(0);
					emaitzaBerriakKudeatu(emaitzenDiv, emaitzenListaBerria);
				} else {
					emaitzaBerriakKudeatu(document.createElement("div"), emaitzenListaBerria);
				}
			}
		}
	});
	observer.observe(emaitzenLista, observerConfig);

	/* BILAKETA INPUT-A */
	let bilaketaInput = document.querySelector("caxaBuscar");


	/* ELEMENTUAK GEHITU DOKUMENTURA */
	// Emaitzen lista berria txertatu dokumentuan
	document.body.appendChild(emaitzenListaBerria);

}

function estiloaEman() {
	for (let elem of document.querySelectorAll(".akta-titulua")) {
		elem.classList.add("p-2"); // Eman banaketa pixka bat irakurtzeko errezago
	}
	for (let elem of document.querySelectorAll(".akta-egileak")) {
		elem.classList.add("p-2"); // Eman banaketa pixka bat irakurtzeko errezago
	}

	// Akta bakoitzari estiloa eman
	for (let akta of document.querySelectorAll(".akta")) {
		akta.classList.add("border", "p-2", "m-2", "text-break", "bg-primary", "border", "border-dark");
		akta.setAttribute("role", "button");
	}

	document.querySelector("#emaitzenLista").classList.add("d-flex", "flex-column", "bg-white")

	document.querySelector("body").classList.add("container");

	document.querySelector("#buscaor").classList.add("text-break", "container", "mw-100", "mt-3", "bg-white");
	document.querySelector("#caxaBuscar").removeAttribute("size");
	document.querySelector("#caxaBuscar").classList.add("w-100")

	/////////////////////////////////////////////////////////////////////////
	//Xabierrek egindako aldaketak
	/////////////////////////////////////////////////////////////////////////
	
	// gorputza div batean sartu panela osatzeko //PROBLEMAS
	/*let gorputza = document.querySelector("body").innerHTML;
	gorputza = "<div class='bg-white vh-90 m-3'>"+gorputza+"</div>";
	document.querySelector("body").innerHTML = gorputza;*/

	// textua <p>-etan sartu eta font-size 6 jarri
	let textua = document.querySelector(".aclaracionPeque").innerHTML;
	textua = "<p class='fs-6 text'>"+textua+"</p>"
	document.querySelector(".aclaracionPeque").innerHTML = textua;

	document.querySelector("#caxaBuscar").classList.add("mt-1","mb-2");
	document.querySelector(".akta-titulua").classList.add("fs-6", "text");
	document.querySelector(".akta-egileak").classList.add("fs-6", "text");

	//document.querySelector("#buscaor").classList.add("bg-white");
	document.querySelector("#emaitzenLista").classList.add("bg-white");
	

	/////////////////////////////////////////////////////////////////////////
	//Xabierrek egindako aldaketak
	/////////////////////////////////////////////////////////////////////////


}

fetch(PROXY + BASE + WEBGUNEA_U)
	.then(r => r.text())
	.then(raw_html => {
		raw_html = raw_html.replace(/(src=")/g, `src="${PROXY}${BASE}/`);
		raw_html = raw_html.replace(/(href=")/g, `href="${PROXY}${BASE}/`);

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

		// Estiloak ez kargatu, guk emango diogulako estiloa
		for (let link of link_s) {
			if (!link.relList.contains("stylesheet"))
				document.querySelector("head").appendChild(link)
		}

		kargatuScript(scripts_s);
		txertatu();

		estiloaEman();
	});

window.addEventListener("load", () => {
	Mezua.sendMezua("LOADED", "");
});