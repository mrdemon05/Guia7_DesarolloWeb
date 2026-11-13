const buttonAgregarPagina = document.querySelector("#idAgregarPagina");
const buttonMenu = document.querySelector("#idAgregarMenu");
const buttonTitulo = document.querySelector("#idAgregarTitulo");
const buttonParrafo = document.querySelector("#idAgregarParrafo");
const pagina = document.querySelector("#idPagina");
const menuPrincipal = document.querySelector("body > header");

buttonAgregarPagina.onclick = () => {
    if (pagina.querySelector("#idDivPage")) {
        alert("Ya se agregó el contenedor de la página");
        return;
    }
    const contenedor = document.createElement("div");
    contenedor.id = "idDivPage";
    contenedor.className = "container";
    contenedor.style.cssText = "border: solid 1px black; height: 500px; overflow-y: scroll; overflow-x: hidden;";
    pagina.appendChild(contenedor);
};

buttonMenu.onclick = () => {
    const contenedor = pagina.querySelector("#idDivPage");
    if (!contenedor) {
        alert("Primero debe agregar un contenedor de página");
        return;
    }
    if (contenedor.querySelector("header")) {
        alert("Ya ha sido agregado el menú");
        return;
    }
    const menu = menuPrincipal.cloneNode(true);
    for (const elemento of menu.querySelectorAll("[id]")) {
        elemento.removeAttribute("id");
    }
    contenedor.appendChild(menu);
};

function agregarTexto(etiqueta, clase, mensaje, errorVacio) {
    const contenedor = pagina.querySelector("#idDivPage");
    if (!contenedor) {
        alert("Primero debe agregar un contenedor de página");
        return;
    }
    if (!contenedor.querySelector("header")) {
        alert("Debe agregar un menú primero");
        return;
    }
    const texto = prompt(mensaje);
    if (!texto?.trim()) {
        alert(errorVacio);
        return;
    }
    const elemento = document.createElement(etiqueta);
    elemento.className = clase;
    elemento.textContent = texto.trim();
    contenedor.appendChild(elemento);
}

buttonTitulo.onclick = () => agregarTexto(
    "h1", "display-5 text-center fw-bold py-4 my-4",
    "Agregue el título de la página",
    "No se ha registrado ningún título. Por favor, ingrese información."
);
buttonParrafo.onclick = () => agregarTexto(
    "p", "lead mb-4 py-4",
    "Agregue un párrafo a su página web",
    "No se ha registrado ningún párrafo. Por favor, ingrese información."
);
