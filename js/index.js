const PROXY = "http://ikasten.io:3000/";
const EDICIONES_U = "https://aenui.org/actas/js/ediciones.js";
const ARTICULOS_U = "https://aenui.org/actas/js/articulos.js";
const RESUMENES_U = "https://aenui.org/actas/js/resumenes.js";
const WEBGUNEA_U = "https://aenui.org/actas/indice_i.html";

function kargatuScript(scripts_s) {
	new Promise((res, rej) => {
		let i = scripts_s.length;
		scripts_s.forEach((script, index) => {
			let src = script.src;
			fetch(src)
				.then(r => r.text())
				.then(js => {
					js = js.replace(/(js\/)/g, `${PROXY}https://aenui.org/actas/js/`);
					js = js.replace(/(img\/)/g, `${PROXY}https://aenui.org/actas/img/`);
					js = js.replace(/(pdf\/)/g, `${PROXY}https://aenui.org/actas/pdf/`);
					js = js.replace(/(fichas\/)/g, `${PROXY}https://aenui.org/actas/fichas/`);
					let elem = document.createElement("script");
					elem.innerHTML = js;
					elem.id = src;
					document.head.appendChild(elem);
					if (index == (i - 1)) {
						eval("inicializar()");
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
	for (let child of emaitzenLista.childNodes) {
		if (child.classList.contains("tituluPonencia") || child.classList.contains("autores")) {
			let elem = document.createElement("div");
			elem.classList.add("p-2");
			elem.innerHTML = child.innerHTML;
			unekoAkta.appendChild(elem);
			if(child.classList.contains("tituluPonencia")) {
				elem.classList.add("aktaTitulua");
				elem.innerText = child.innerText.replace(/(\[PDF\])/g,"");
				unekoAkta.addEventListener("click", () => {
					let indiz = child.attributes["onclick"].nodeValue.replace("amosarFicha(","").replace(")","");
					console.log(indiz);
					var num = "" + indiz;
					while (num.length < 4)
					num = "0" + num;
					var urlFicha = "https://aenui.org/actas/fichas/" + articulos[indiz][0] + "_" + articulos[indiz][1] + "_" + num + ".html";
					
					let params = `scrollbars=no,resizable=no,status=no,location=no,toolbar=no,menubar=no,width=0,height=0,left=-1000,top=-1000`
					window.open(urlFicha,elem.innerText,params);
				});
			} else {
				elem.classList.add("aktaEgileak");
			}
		}
		if (unekoAkta.childNodes.length >= 2) {
			// akta bat bere titulu eta autoreekin osatu dugu, akta gorde
			aktak.push(unekoAkta);
			unekoAkta = document.createElement("div");
		}
	}

	// Akta bakoitzari estiloa eman
	for(let akta of aktak) {
		akta.classList.add("rounded","bg-secondary","p-2","m-2","text-break");
		akta.setAttribute("role","button");
		emaitzenContainer.appendChild(akta);
	}

}

function izkutatu(elementua) {
	let wrapper = document.createElement("div");
	wrapper.style = "display:none;";
	elementua.parentNode.insertBefore(wrapper,elementua);
	wrapper.appendChild(elementua);
}

function txertatu() {
	// Edizioen lista
	let edizioak = document.querySelector("#botonesEdiciones").childNodes;

	// Izkutatu edizioak
	izkutatu(document.querySelector("#botonesEdiciones"));
	izkutatu(document.querySelector(".botonEdiciones"));

	// Emaitzak kudeatu
	let emaitzenLista = document.querySelector("#resultaos");
	// Emaitzen lista izkutatu
	izkutatu(emaitzenLista);
	// Emaitzen lista berria sortu
	let emaitzenListaBerria = document.createElement("div");
	emaitzenListaBerria.id = "emaitzenLista";
	emaitzenListaBerria.classList.add("container-fluid","d-flex","flex-column")
	// Emaitza berriak gehitzen direnean detektatu
	let observerConfig = { attributes: false, childList: true, subtree: false };
	let observer = new MutationObserver((mutationList, observer) => {
		for (const mutation of mutationList) {
			if (mutation.type === 'childList') { // elementu bat gehitu edo ezabatu da
				if (mutation.addedNodes.length > 0) {
					let emaitzenDiv = mutation.addedNodes.item(0);
					emaitzaBerriakKudeatu(emaitzenDiv,emaitzenListaBerria);
				} else {
					emaitzaBerriakKudeatu(document.createElement("div"),emaitzenListaBerria);
				}
			}
		}
	});
	observer.observe(emaitzenLista, observerConfig);

	// Emaitzen lista berria txertatu dokumentuan
	document.body.appendChild(emaitzenListaBerria);

}

fetch(PROXY + WEBGUNEA_U)
	.then(r => r.text())
	.then(raw_html => {
		raw_html = raw_html.replace(/(src=")/g, `src="${PROXY}https://aenui.org/actas/`);
		raw_html = raw_html.replace(/(href=")/g, `href="${PROXY}https://aenui.org/actas/`);

		let parser = new DOMParser();
		let html = parser.parseFromString(raw_html, "text/html");

		document.querySelector("body").innerHTML = html.body.innerHTML;

		document.head.innerHTML += `<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-Zenh87qX5JnK2Jl0vWa8Ck2rdkQ2Bzep5IDxbcnCeuOxjzrPF/et3URy9Bv1WTRi" crossorigin="anonymous">
	<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-OERcA2EqjJCMA+/3y+gxIOqMEjwtxJY7qPCqsdltbNJuaOe923+mo//f6V8Qbsw3" crossorigin="anonymous"></script>
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	`;

		let scripts_s = html.querySelectorAll("script");
		let styles_s = html.querySelectorAll("link");

		// for (let style of styles_s) {
		// 	document.head.innerHTML += style.outerHTML;
		// }

		kargatuScript(scripts_s);
		txertatu();
	});
