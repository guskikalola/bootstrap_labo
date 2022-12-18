import HistorialaKudeatzailea from "./historialaKudeatzailea.js";
import Mezua from "./mezuak.js";

const PROXY = "https://guskikalola.eus/cors/";
const EDICIONES_U = "https://aenui.org/actas/js/ediciones.js";
const ARTICULOS_U = "https://aenui.org/actas/js/articulos.js";
const RESUMENES_U = "https://aenui.org/actas/js/resumenes.js";
const BASE = "aenui.org/actas";
const WEBGUNEA_U = "/indice_i.html";

window.articulos = JSON.parse(localStorage.getItem("articulos"));
window.ediciones = JSON.parse(localStorage.getItem("ediciones"));

function getLlistaResultaosTestuV2(str, estrictu) {
	let filtroak = {
		"izenburua": document.getElementById("filtroIzenburua").checked,
		"egile": document.getElementById("filtroEgilea").checked,
		"hitz_gakoa": document.getElementById("filtroHitzgakoak").checked,
		"filtro_guztiak": document.getElementById("filtroGuztiak").checked
	}

	var llista = new Set();

	str = convertirPaBusqueda(str);

	for (var i = 0; i < temasBusqueda.length; i++) {
		let sartu = false;

		if ((filtroak.filtro_guztiak || filtroak.izenburua) && articulos[i][2].toLowerCase().indexOf(str) != -1) {
			sartu = true;
		} else if ((filtroak.filtro_guztiak || filtroak.egile) && articulos[i][3].toLowerCase().indexOf(str) != -1) {
			sartu = true;
		} else if (filtroak.filtro_guztiak || filtroak.hitz_gakoa) {
			let hitzGakoPosibleGuztiak = articulos[i].join("").toLowerCase();
			let hitzGakoak = str.split(" ");
			let guztiakDitu = true;
			for (let hitzGakoa of hitzGakoak) {
				if (hitzGakoPosibleGuztiak.indexOf(hitzGakoa) == -1) {
					guztiakDitu = false;
					break;
				}
			}
			sartu = guztiakDitu;
		}

		if (sartu) {
			llista.add(i);
		}
	}
	return Array.from(llista);
}

function amosarResultaosPorTestuV2(str, estrictu) {
	esconderAyuda();
	if (str.length < 3) {
		ponerHtmlPorId("contaorResultaos", "");
		ponerHtmlPorId("resultaos", "");
		return;
	} else {
		var llista = getLlistaResultaosTestuV2(str, estrictu);
		ponerHtmlPorId("resultaos", HTMLResultau(llista));
		// Esto por si llamen esta función dende programa, y non por haber tecleáo
		if (document.getElementById("caxaBuscar").value == "")
			document.getElementById("caxaBuscar").value = str;
	}
}

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
					if (src.indexOf("articulos") == -1 && src.indexOf("ediciones") == -1) document.head.appendChild(elem);
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
			///////////////////////////////////////
			//XABIERREN ALDAKETA
			////////////////////////////////////////
			let elemP = document.createElement("p");
			elemP.classList.add("ps-4");
			elemP.innerHTML = child.innerHTML;
			elem.appendChild(elemP)
			///////////////////////////////////////
			//XABIERREN ALDAKETA
			////////////////////////////////////////

			// Uneko aktari gehitu elementua
			unekoAkta.appendChild(elem);

			if (child.classList.contains("tituluPonencia")) {

				// Elementua titulua bada gehitu klasea hori adierazteko
				elem.classList.add("akta-titulua");
				elem.classList.add("fs-5", "fw-bold", "text-center");
				elem.innerText = child.innerText.replace(/(\[PDF\])/g, ""); // Ezabatu [PDF]

				// Aktaren gainean klikatzean tituluan zegoen onclick funtzio berdina egin baino lehio berri bat irikita
				unekoAkta.addEventListener("click", () => {
					let indiz = child.attributes["onclick"].nodeValue.replace("amosarFicha(", "").replace(")", "");
					var num = "" + indiz;
					while (num.length < 4)
						num = "0" + num;
					var urlFicha = `informazioa?url=https://${BASE}/fichas/` + articulos[indiz][0] + "_" + articulos[indiz][1] + "_" + num + ".html";

					Mezua.sendMezua("CHVIEW", urlFicha);
					HistorialaKudeatzailea.getInstance().gordeHistorialan(indiz);
				});
			} else {
				// Elementua egileak bada gehitu klasea hori adierazteko
				elem.classList.add("akta-egileak");
				elem.classList.add("fs-5", "pl-4");
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
		akta.classList.add("col-10", "mx-auto");
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

function wrap(elementua, id) {
	let wrapper = document.createElement("div");
	wrapper.id = id;
	wrapper.appendChild(elementua);
	return wrapper;
}

function txertatu() {
	/* EDIZIOAK */
	// Edizioen lista
	let edizioakContainer = document.createElement("div"); edizioakContainer.id = "edizioakContainer";
	window.ediciones.forEach((edizioa, edizioaId) => {
		let urtea = edizioa[0];
		let portada = PROXY + BASE + `/img/portada_JENUI_${urtea}.jpg`;

		let edizioaContainer = document.createElement("div"); edizioa.id = "edizioa-" + urtea;
		edizioaContainer.classList.add("edizioa");

		edizioaContainer.addEventListener("click", function (e) {
			eval(`amosarResultaosPorEdicion("${edizioaId}")`);
		});

		let urteaElem = document.createElement("p");
		urteaElem.classList.add("edizoa-urtea");
		urteaElem.innerText = urtea;

		let portadaContainer = document.createElement("div");
		portadaContainer.classList.add("edizioa-portada-container");
		let portadaElem = document.createElement("img");
		portadaElem.src = portada;
		portadaElem.classList.add("edizioa-portada");

		edizioaContainer.appendChild(urteaElem);
		edizioaContainer.appendChild(portadaElem);

		edizioakContainer.appendChild(edizioaContainer);
	});

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
	emaitzenLista.classList.add("rounded-bottom")
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
	let bilaketaInput = document.querySelector("#caxaBuscar");
	bilaketaInput.onkeyup = "";
	bilaketaInput.addEventListener("keyup", (e) => {
		let target = e.target;
		let value = target.value;
		amosarResultaosPorTestuV2(value, false);
	})

	/* BILAKETA FILTROAK */
	let containerDropdownFiltroak = document.createElement("div");
	let containerDropdownMenuFiltroak = document.createElement("div");
	let containerDropdownMenuBtn = document.createElement("button");
	let containerFiltroak = document.createElement("div");
	let filtroEgilea = document.createElement("input"), egileaLabel = document.createElement("label");
	let filtroIzenburua = document.createElement("input"), izenburuaLabel = document.createElement("label");
	let filtroHitzgakoak = document.createElement("input"), hitzgakoakLabel = document.createElement("label");
	let filtroGuztiak = document.createElement("input"), guztiakLabel = document.createElement("label");

	containerDropdownFiltroak.id = "containerDropdownFiltroak";
	containerDropdownMenuFiltroak.id = "containerDropdownMenuFiltroak";
	containerDropdownMenuBtn.id = "containerDropdownMenuBtn";
	containerFiltroak.id = "containerFiltroak";
	filtroEgilea.id = "filtroEgilea", egileaLabel.id = "egileaLabel";
	filtroGuztiak.id = "filtroGuztiak", guztiakLabel.id = "guztiakLabel";
	filtroHitzgakoak.id = "filtroHitzgakoak", hitzgakoakLabel.id = "hitzgakoakLabel";
	filtroIzenburua.id = "filtroIzenburua", izenburuaLabel.id = "izenburuaLabel";



	egileaLabel.htmlFor = "filtroEgilea"; egileaLabel.innerText = "Egilea";
	izenburuaLabel.htmlFor = "filtroIzenburua"; izenburuaLabel.innerText = "Izenburua";
	hitzgakoakLabel.htmlFor = "filtroHitzgakoak"; hitzgakoakLabel.innerText = "Hitz Gakoak";
	guztiakLabel.htmlFor = "filtroGuztiak"; guztiakLabel.innerText = "Guztiak";
	containerDropdownMenuBtn.innerText = "Filtroak";

	containerDropdownMenuBtn.setAttribute("data-bs-toggle", "dropdown");

	filtroEgilea.type = "checkbox";
	filtroGuztiak.type = "checkbox";
	filtroHitzgakoak.type = "checkbox";
	filtroIzenburua.type = "checkbox";

	filtroEgilea.addEventListener("click", filtroKudeatu);
	filtroGuztiak.addEventListener("click", filtroKudeatu);
	filtroHitzgakoak.addEventListener("click", filtroKudeatu);
	filtroIzenburua.addEventListener("click", filtroKudeatu);

	containerDropdownMenuFiltroak.appendChild(containerFiltroak);
	containerDropdownFiltroak.appendChild(containerDropdownMenuBtn);
	containerDropdownFiltroak.appendChild(containerDropdownMenuFiltroak);

	let wrapperEgilea = wrap(filtroEgilea, "wrapperEgilea");
	let wrapperGuztiak = wrap(filtroGuztiak, "wrapperGuztiak");
	let wrapperHitzgakoak = wrap(filtroHitzgakoak, "wrapperHitzgakoak");
	let wrapperIzenburua = wrap(filtroIzenburua, "wrapperIzenburua");

	containerFiltroak.appendChild(wrapperIzenburua); wrapperIzenburua.appendChild(izenburuaLabel);
	containerFiltroak.appendChild(wrapperEgilea); wrapperEgilea.appendChild(egileaLabel);
	containerFiltroak.appendChild(wrapperHitzgakoak); wrapperHitzgakoak.appendChild(hitzgakoakLabel);
	containerFiltroak.appendChild(wrapperGuztiak); wrapperGuztiak.appendChild(guztiakLabel);

	containerDropdownMenuFiltroak.onclick = (e) => e.stopPropagation();


	filtroGuztiak.checked = true;

	function filtroKudeatu(e) {
		let target = e.target;
		if (target.id != "filtroGuztiak") {
			if (target.checked) {
				filtroGuztiak.checked = false;
			} else {
				if (!filtroEgilea.checked && !filtroIzenburua.checked && !filtroHitzgakoak.checked) {
					filtroGuztiak.checked = true;
				}
			}
		} else {
			filtroGuztiak.checked = true;
			filtroEgilea.checked = false;
			filtroIzenburua.checked = false;
			filtroHitzgakoak.checked = false;
		}

		amosarResultaosPorTestuV2(bilaketaInput.value, false);
	}

	/* ELEMENTUAK GEHITU DOKUMENTURA */
	// Bilaketa filtroak gehitu
	document.body.appendChild(containerDropdownFiltroak);
	// Edizioak gehitu
	document.body.appendChild(edizioakContainer)
	// Emaitzen lista berria txertatu dokumentuan
	document.body.appendChild(emaitzenListaBerria);



	/*BILAKETA PANELARI EGITURA BERRIA EMAN RESPONSIVE IZATEKO*/
	/*Osagaiak hartu eta div-etan sartu bootstrap klaseekin konbinatuz taula bat erabili beharrean*/

	let caxaBuscar = document.getElementById("caxaBuscar");
	let drop = document.querySelector('#containerDropdownFiltroak');

	//lehen ilara
	let lehenIlara = document.createElement('div');
	lehenIlara.classList.add("row", "d-flex", "justify-content-center");
	let lehenIlaraBarrukoa = document.createElement('h1');
	lehenIlaraBarrukoa.classList.add("col-10", "h1", "text-center", "py-2");
	lehenIlaraBarrukoa.textContent = 'Actas de JENUI - Integral (β)';

	lehenIlara.appendChild(lehenIlaraBarrukoa);

	//bigarren ilara
	let bigarrenIlara = document.createElement('div');
	bigarrenIlara.classList.add("row");
	let bigarrenIlaraBat = document.createElement('div');
	bigarrenIlaraBat.classList.add("col-xs-12", "col-md-2", "d-flex", "justify-content-center");
	let bigarrenIlaraBatEsteka = document.createElement('a');
	bigarrenIlaraBatEsteka.id = 'alrodiu';
	let bigarrenIlaraBatEstekaIrudia = document.createElement('img');
	bigarrenIlaraBatEstekaIrudia.classList.add('img-fluid');
	bigarrenIlaraBatEstekaIrudia.src = 'https://guskikalola.eus/cors/aenui.org/actas/img/logoAenui.png';
	bigarrenIlaraBatEstekaIrudia.classList.add('img-fluid'); // ez dizkiot jarri

	bigarrenIlaraBatEsteka.appendChild(bigarrenIlaraBatEstekaIrudia);
	bigarrenIlaraBat.appendChild(bigarrenIlaraBatEsteka);

	let bigarrenIlaraBi = document.createElement('div');
	bigarrenIlaraBi.classList.add('aclaracionPeque', "col-xs-12", "col-md-10");
	let bigarrenIlaraBiBat = document.createElement('p');
	bigarrenIlaraBiBat.classList.add('h-3', 'text', "pt-2", "pb-1", "pe-2");
	bigarrenIlaraBiBat.textContent = 'Idatzi bilaketa-terminoak (izenburua eta egilea) edo sakatu "Edizioak..." botoiaedizio bateko ponentzia guztiak ikusteko.'
	let bigarrenIlaraBiBi = document.createElement('p');
	bigarrenIlaraBiBi.classList.add('h-4', 'text', "pb-2", "pe-2");
	bigarrenIlaraBiBi.textContent = 'Klikatu hitzaldiaren izenburuan eskuinean fitxa eta lotutako baliabideak ikusteko (laburpena, datu bibliografikoak, etab.)'

	bigarrenIlaraBi.appendChild(bigarrenIlaraBiBat);
	bigarrenIlaraBi.appendChild(bigarrenIlaraBiBi);

	bigarrenIlara.appendChild(bigarrenIlaraBat);
	bigarrenIlara.appendChild(bigarrenIlaraBi);

	// hirugarren ilara
	let hirugarrenIlara = document.createElement('div');
	hirugarrenIlara.classList.add('row', 'py-2');

	let hirugarrenIlaraBat = document.createElement('div');
	hirugarrenIlaraBat.classList.add('col-md-2', 'col-xs-6', 'd-flex', 'flex-row-reverse');
	hirugarrenIlaraBat.appendChild(drop);

	let hirugarrenIlaraBi = document.createElement('div');
	hirugarrenIlaraBi.classList.add('col-md-9', 'col-xs-6');
	//caxaBuscar.child.classList.add("col-10");
	hirugarrenIlaraBi.appendChild(caxaBuscar);

	hirugarrenIlara.appendChild(hirugarrenIlaraBat);
	hirugarrenIlara.appendChild(hirugarrenIlaraBi);

	document.querySelector('#buscaor').innerHTML = "";

	// laugarren ilara
	/*let edizioak = document.querySelector('#edizioakContainer');
	//document.querySelector('#edizioakContainer').innerHTML='';
	let laugarrenIlara = document.createElement('div');
	laugarrenIlara.appendChild(edizioak);
	laugarrenIlara.classList.add('row');*/


	/* LOGOA */
	let logoa = bigarrenIlaraBatEsteka;
	logoa.href = "";
	console.log(logoa)
	logoa.addEventListener("click", () => {
		Mezua.sendMezua("CHVIEW", "hasiera");
	});


	document.querySelector('#buscaor').appendChild(lehenIlara);
	document.querySelector('#buscaor').appendChild(bigarrenIlara);
	document.querySelector('#buscaor').appendChild(hirugarrenIlara);
	//document.querySelector('#buscaor').appendChild(laugarrenIlara);


}

function estiloaEman() {
	for (let elem of document.querySelectorAll(".akta-titulua")) {
		elem.classList.add("p-2", "fs-5"); // Eman banaketa pixka bat irakurtzeko errezago
	}
	for (let elem of document.querySelectorAll(".akta-egileak")) {
		elem.classList.add("p-2"); // Eman banaketa pixka bat irakurtzeko errezago
	}

	// Akta bakoitzari estiloa eman
	for (let akta of document.querySelectorAll(".akta")) {
		akta.classList.add("border", "p-2", "m-2", "text-break", "bg-primary", "border", "border-dark", "rounded-1");
		akta.setAttribute("role", "button");
	}

	document.querySelector("#emaitzenLista").classList.add("d-flex", "flex-column", "bg-white")

	document.querySelector("body").classList.add("container");

	document.querySelector("#buscaor").classList.add("text-break", "container", "mw-100", "mt-3", "bg-white", "rounded-top");
	document.querySelector("#caxaBuscar").removeAttribute("size");
	document.querySelector("#caxaBuscar").classList.add("w-100");

	/* FILTROAK */
	document.querySelector("#containerDropdownFiltroak").classList.add("dropdown");
	document.querySelector("#containerDropdownMenuBtn").classList.add("btn", "btn-primary", "dropdown-toggle");
	document.querySelector("#containerDropdownMenuFiltroak").classList.add("dropdown-menu");
	document.querySelector("#containerFiltroak").classList.add("form-switch", "d-flex", "flex-column", "m-2");
	document.querySelector("#filtroGuztiak").classList.add("form-check-input");
	document.querySelector("#filtroEgilea").classList.add("form-check-input");
	document.querySelector("#filtroIzenburua").classList.add("form-check-input");
	document.querySelector("#filtroHitzgakoak").classList.add("form-check-input");
	// document.querySelector("#wrapperGuztiak").classList.add("dropdown-item");
	// document.querySelector("#wrapperEgilea").classList.add("dropdown-item");
	// document.querySelector("#wrapperIzenburua").classList.add("dropdown-item");
	// document.querySelector("#wrapperHitzgakoak").classList.add("dropdown-item");
	document.querySelector("#caxaBuscar").classList.add("w-100")

	/////////////////////////////////////////////////////////////////////////
	//Xabierrek egindako aldaketak
	/////////////////////////////////////////////////////////////////////////
	/*	
		// gorputza div batean sartu panela osatzeko PROBLEMAS
		let gorputza = document.querySelector("body").innerHTML;
		gorputza = "<div class='bg-white vh-90 m-3'>"+gorputza+"</div>";
		document.querySelector("body").innerHTML = gorputza;
	*/

	document.querySelector("#caxaBuscar").classList.add("mt-1", "mb-2");

	//document.querySelector("#buscaor").classList.add("bg-white");
	document.querySelector("#emaitzenLista").classList.add("bg-white", "container", "rounded-bottom", "mb-3");

	//document.querySelectorAll(".akta").classList.add("col-xs-11 col-md-9", "mx-auto", "shadow")


	/////////////////////////////////////////////////////////////////////////
	//Xabierrek egindako aldaketakinput

	/////////////////////////////////////////////////////////////////////////


	// Edizioak
	for (let elem of document.querySelectorAll(".edizioa")) {
		elem.classList.add("d-flex", "mx-2", "flex-column", "align-items-center", "justify-content-center", "text-center");
		elem.classList.add("btn")
		elem.classList.add("bg-secondary");
	}
	for (let elem of document.querySelectorAll(".edizioa-portada-container")) {

	}
	for (let elem of document.querySelectorAll(".edizioa-portada")) {
		elem.width = 125;
		elem.height = 125;
		elem.classList.add("img-fluid","img")
	}
	for (let elem of document.querySelectorAll(".edizioa-urtea")) {

	}

	document.querySelector("#edizioakContainer").classList.add("d-flex", "flex-row", "bg-white")
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

		scripts_s = Array.from(scripts_s.values()).filter(item => (item.src.indexOf("articulos") == -1 && item.src.indexOf("ediciones") == -1))
		console.log(scripts_s)
		kargatuScript(scripts_s);
		txertatu();
		estiloaEman();

	});

window.addEventListener("load", () => {
	Mezua.sendMezua("LOADED", "");
});
