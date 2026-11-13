const buttonSpan = document.getElementById("idBtnSpan");
const buttonP = document.getElementById("idBtnP");
const buttonDiv = document.getElementById("idBtnDiv");
const buttonButton = document.getElementById("idBtnButton");

function contarElementos(etiqueta) {
    const elementos = document.getElementsByTagName(etiqueta);
    console.log(`Etiquetas buscadas <${etiqueta}></${etiqueta}> / Total encontradas: ${elementos.length}`);
    for (const elemento of elementos) {
        console.log(elemento);
    }
    alert("Revise la consola del navegador");
}

buttonSpan.onclick = () => contarElementos("span");
buttonP.onclick = () => contarElementos("p");
buttonDiv.onclick = () => contarElementos("div");
buttonButton.onclick = () => contarElementos("button");
