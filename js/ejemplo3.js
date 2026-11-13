function cambiarColorFondo(event) {
    document.body.style.backgroundColor = event.target.value;
}

function cambiarColorTitulos(event) {
    for (const titulo of document.querySelectorAll("h1")) {
        titulo.style.color = event.target.value;
    }
}

function cambiarColorParrafos(event) {
    for (const parrafo of document.querySelectorAll("p")) {
        parrafo.style.color = event.target.value;
    }
}

function startDOM() {
    const controlesColor = [
        ["idFondo", "#ffffff", cambiarColorFondo],
        ["idTitulos", "#000000", cambiarColorTitulos],
        ["idParrafos", "#000000", cambiarColorParrafos]
    ];
    for (const [id, colorInicial, cambiarColor] of controlesColor) {
        const control = document.getElementById(id);
        control.value = colorInicial;
        control.addEventListener("input", cambiarColor);
        control.addEventListener("change", cambiarColor);
    }

    const elementos = [document.body, ...document.querySelectorAll("h1, p")];
    const tamanosOriginales = elementos.map((elemento) => parseFloat(getComputedStyle(elemento).fontSize));
    let escala = 1;

    function cambiarTamano(variacion) {
        escala = Math.max(0.5, escala + variacion);
        elementos.forEach((elemento, indice) => {
            elemento.style.fontSize = `${tamanosOriginales[indice] * escala}px`;
        });
    }

    document.getElementById("idBtnAumentar").addEventListener("click", () => cambiarTamano(0.005));
    document.getElementById("idBtnDisminuir").addEventListener("click", () => cambiarTamano(-0.005));
}

startDOM();
