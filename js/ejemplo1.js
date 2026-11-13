const newForm = document.getElementById("idNewForm");
const buttonCrear = document.getElementById("idBtnCrear");
const cmbElemento = document.getElementById("idCmbElemento");
const formElemento = document.getElementById("idFormElemento");
const tituloElemento = document.getElementById("idTituloElemento");
const nombreElemento = document.getElementById("idNombreElemento");
const modalElemento = document.getElementById("idModal");
const modal = new bootstrap.Modal(modalElemento);

function verificarTipoElemento() {
    if (cmbElemento.value === "") {
        alert("Debe seleccionar el elemento que se creará");
        return;
    }
    modal.show();
}

function agregarControl(control, titulo, claseContenedor, claseEtiqueta, conIcono = false) {
    const etiqueta = document.createElement("label");
    etiqueta.htmlFor = control.id;
    etiqueta.className = claseEtiqueta;
    etiqueta.textContent = titulo;

    if (conIcono) {
        const icono = document.createElement("i");
        icono.className = "bi bi-tag me-1";
        icono.setAttribute("aria-hidden", "true");
        etiqueta.insertAdjacentElement("afterbegin", icono);
    }

    const identificador = document.createElement("span");
    identificador.textContent = `ID de control: ${control.id}`;

    const contenedor = document.createElement("div");
    contenedor.className = claseContenedor;
    contenedor.appendChild(control);
    contenedor.appendChild(etiqueta);
    newForm.appendChild(identificador);
    newForm.appendChild(contenedor);
}

function newSelect(id, nombre, titulo) {
    const control = document.createElement("select");
    control.id = id;
    control.name = nombre;
    control.className = "form-select";

    for (let i = 1; i <= 10; i++) {
        const opcion = document.createElement("option");
        opcion.value = i;
        opcion.textContent = `Opción ${i}`;
        control.appendChild(opcion);
    }
    agregarControl(control, titulo, "form-floating mb-3", "");
}

function newRadioCheckbox(tipo, id, nombre, titulo) {
    const control = document.createElement("input");
    control.id = id;
    control.name = nombre;
    control.type = tipo;
    control.className = "form-check-input";
    agregarControl(control, titulo, "form-check mb-3", "form-check-label");
}

function newInput(tipo, id, nombre, titulo) {
    const control = document.createElement(tipo === "textarea" ? "textarea" : "input");
    control.id = id;
    control.name = nombre;
    control.className = "form-control";
    control.placeholder = titulo;
    if (tipo !== "textarea") {
        control.type = tipo;
    }
    agregarControl(control, titulo, "form-floating mb-3", "", true);
}

buttonCrear.onclick = verificarTipoElemento;

formElemento.addEventListener("submit", (event) => {
    event.preventDefault();
    const titulo = tituloElemento.value.trim();
    const nombre = nombreElemento.value.trim();
    if (!nombre || !titulo) {
        alert("Faltan campos por completar");
        (titulo ? nombreElemento : tituloElemento).focus();
        return;
    }

    const idBase = `id${nombre.replace(/\s+/g, "-")}`;
    let id = idBase;
    for (let sufijo = 2; document.getElementById(id); sufijo++) {
        id = `${idBase}-${sufijo}`;
    }
    const tipo = cmbElemento.value;
    if (tipo === "select") {
        newSelect(id, nombre, titulo);
    } else if (tipo === "radio" || tipo === "checkbox") {
        newRadioCheckbox(tipo, id, nombre, titulo);
    } else {
        newInput(tipo, id, nombre, titulo);
    }
    modal.hide();
});

modalElemento.addEventListener("shown.bs.modal", () => {
    formElemento.reset();
    tituloElemento.focus();
});
