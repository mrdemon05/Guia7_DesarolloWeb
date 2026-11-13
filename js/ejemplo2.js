const formulario = document.forms.frmRegistro;
const campos = formulario.elements;
const errorRegistro = document.getElementById("idErrorRegistro");
const modal = new bootstrap.Modal(document.getElementById("idModal"));
const bodyModal = document.getElementById("idBodyModal");
const formatoCorreo = /^[^\s@.]+(?:\.[^\s@.]+)*@(?:[a-z\d](?:[a-z\d-]*[a-z\d])?\.)+[a-z\d](?:[a-z\d-]*[a-z\d])?$/i;

function recorrerFormulario() {
    const totales = { text: 0, password: 0, radio: 0, checkbox: 0, date: 0, email: 0, file: 0, select: 0 };

    for (const elemento of campos) {
        if (elemento.nodeName === "SELECT") {
            totales.select++;
        } else if (elemento.nodeName === "INPUT" && Object.hasOwn(totales, elemento.type)) {
            totales[elemento.type]++;
        }
    }

    return Object.entries(totales).map(([tipo, total]) => [
        tipo === "select" ? "select" : `input[type="${tipo}"]`,
        total
    ]);
}

function fechaActual() {
    const hoy = new Date();
    return new Date(Date.UTC(hoy.getFullYear(), hoy.getMonth(), hoy.getDate()))
        .toISOString().slice(0, 10);
}

function validarFormulario(intereses, carrera) {
    const { idNombre, idApellidos, idFechaNac, idCorreo, idPassword, idPasswordRepetir, idCmPais, idArchivo } = campos;

    for (const campo of [idNombre, idApellidos, idFechaNac, idCorreo, idPassword, idPasswordRepetir]) {
        if (!campo.value.trim()) {
            return [campo, `Complete el campo «${campo.labels[0].textContent.trim()}».`];
        }
    }

    idFechaNac.max = fechaActual();
    if (idFechaNac.validity.rangeOverflow) {
        return [idFechaNac, "La fecha de nacimiento no puede ser posterior a la fecha actual."];
    }
    if (idCorreo.validity.typeMismatch || !formatoCorreo.test(idCorreo.value)) {
        return [idCorreo, "Ingrese un correo electrónico válido."];
    }
    if (idPassword.value !== idPasswordRepetir.value) {
        return [idPasswordRepetir, "Las contraseñas deben coincidir."];
    }
    if (intereses.length === 0) {
        return [campos.idCkProgramacion, "Seleccione al menos un interés."];
    }
    if (!carrera) {
        return [campos.idRdIng, "Seleccione una carrera."];
    }
    if (!idCmPais.value) {
        return [idCmPais, "Seleccione su país de origen."];
    }
    if (idArchivo.files.length === 0) {
        return [idArchivo, "Seleccione una imagen para su avatar."];
    }
    return null;
}

function crearTabla(titulo, encabezados, filas) {
    const tabla = document.createElement("table");
    tabla.className = "table table-sm align-middle caption-top text-break";
    const caption = document.createElement("caption");
    caption.className = "fw-bold text-body";
    caption.appendChild(document.createTextNode(titulo));
    tabla.appendChild(caption);

    const cabecera = document.createElement("thead");
    const encabezado = document.createElement("tr");
    for (const texto of encabezados) {
        const celda = document.createElement("th");
        celda.scope = "col";
        celda.appendChild(document.createTextNode(texto));
        encabezado.appendChild(celda);
    }
    cabecera.appendChild(encabezado);
    tabla.appendChild(cabecera);

    const cuerpo = document.createElement("tbody");
    for (const [nombre, valor] of filas) {
        const fila = document.createElement("tr");
        const etiqueta = document.createElement("th");
        etiqueta.scope = "row";
        etiqueta.appendChild(document.createTextNode(nombre));
        const celda = document.createElement("td");
        celda.appendChild(document.createTextNode(valor));
        fila.appendChild(etiqueta);
        fila.appendChild(celda);
        cuerpo.appendChild(fila);
    }
    tabla.appendChild(cuerpo);
    return tabla;
}

function mostrarRegistro(intereses, carrera) {
    const datos = [
        ["Nombres", campos.idNombre.value.trim()],
        ["Apellidos", campos.idApellidos.value.trim()],
        ["Fecha de nacimiento", campos.idFechaNac.value.split("-").reverse().join("/")],
        ["Correo electrónico", campos.idCorreo.value],
        ["Contraseña", "••••••••"],
        ["Repetir contraseña", "••••••••"],
        ["Intereses", intereses.map((campo) => campo.labels[0].textContent.trim()).join(", ")],
        ["Carrera", carrera.labels[0].textContent.trim()],
        ["País de origen", campos.idCmPais.selectedOptions[0].textContent],
        ["Imagen de avatar", campos.idArchivo.files[0].name]
    ];
    while (bodyModal.firstChild) {
        bodyModal.removeChild(bodyModal.firstChild);
    }
    bodyModal.appendChild(crearTabla("Datos ingresados", ["Campo", "Valor"], datos));
    bodyModal.appendChild(crearTabla("Controles del formulario", ["Tipo", "Cantidad"], recorrerFormulario()));
    modal.show();
}

campos.idFechaNac.max = fechaActual();

formulario.addEventListener("submit", (event) => {
    event.preventDefault();
    errorRegistro.hidden = true;
    for (const campo of formulario.querySelectorAll(".is-invalid")) {
        campo.classList.remove("is-invalid");
        campo.removeAttribute("aria-invalid");
    }

    const intereses = Array.from(formulario.querySelectorAll('input[type="checkbox"]:checked'));
    const carrera = formulario.querySelector('input[name="idRdCarrera"]:checked');
    const error = validarFormulario(intereses, carrera);

    if (error) {
        const [campo, mensaje] = error;
        campo.classList.add("is-invalid");
        campo.setAttribute("aria-invalid", "true");
        errorRegistro.textContent = mensaje;
        errorRegistro.hidden = false;
        campo.focus();
        return;
    }
    mostrarRegistro(intereses, carrera);
});
