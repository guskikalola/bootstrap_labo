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
					if(index == (i-1)) {
						eval("inicializar()");
					}
				})
		});
	})
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

		for (let style of styles_s) {
			document.head.innerHTML += style.outerHTML;
		}


		kargatuScript(scripts_s);
	});
