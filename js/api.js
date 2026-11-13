// La API original ofrece la clave pública 1 para uso educativo.
const api = "https://www.thecocktaildb.com/api/json/v1/1/";
const listado = document.getElementById("listadoBebidas");
const estadoListado = document.getElementById("estadoListado");
const estadoDetalle = document.getElementById("estadoDetalle");
const detalle = document.getElementById("detalleBebida");
let bebidaActiva;
let solicitudDetalle;

async function consultarBebidas(endpoint, signal = AbortSignal.timeout(12000)) {
    const respuesta = await fetch(new URL(endpoint, api), { signal });
    if (!respuesta.ok) {
        throw new Error(`HTTP ${respuesta.status}`);
    }
    const { drinks } = await respuesta.json();
    return drinks ?? [];
}

async function cargarListado() {
    estadoListado.textContent = "Cargando bebidas…";
    listado.setAttribute("aria-busy", "true");

    try {
        const bebidas = await consultarBebidas("filter.php?a=Non_Alcoholic");
        const opciones = document.createDocumentFragment();
        for (const bebida of bebidas) {
            const item = document.createElement("li");
            item.className = "list-group-item p-0";

            const boton = document.createElement("button");
            boton.type = "button";
            boton.className = "list-group-item list-group-item-action border-0 rounded-0 mb-0";
            boton.textContent = bebida.strDrink;
            boton.setAttribute("aria-pressed", "false");
            boton.addEventListener("click", () => cargarDetalle(bebida, boton));
            item.appendChild(boton);
            opciones.appendChild(item);
        }
        listado.replaceChildren(opciones);
        estadoListado.textContent = bebidas.length === 0 ? "No se encontraron bebidas." : "";
    } catch {
        estadoListado.textContent = "No se pudo cargar el listado de bebidas.";
    } finally {
        listado.removeAttribute("aria-busy");
    }
}

function mostrarDetalle(bebida) {
    const fila = document.createElement("div");
    fila.className = "row g-3 mt-1";
    if (bebida.strDrinkThumb) {
        const columna = document.createElement("div");
        columna.className = "col-lg-5";
        const foto = document.createElement("img");
        foto.className = "foto-bebida rounded";
        foto.alt = bebida.strDrink;
        foto.src = bebida.strDrinkThumb;
        columna.appendChild(foto);
        fila.appendChild(columna);
    }

    const informacion = document.createElement("div");
    informacion.className = "col";
    const titulo = document.createElement("h3");
    titulo.className = "h4";
    titulo.textContent = bebida.strDrink;
    const datos = document.createElement("p");
    datos.className = "small text-body-secondary";
    datos.textContent = [bebida.strCategory, bebida.strGlass].filter(Boolean).join(" · ");

    const tituloIngredientes = document.createElement("h4");
    tituloIngredientes.className = "h6";
    tituloIngredientes.textContent = "Ingredientes";
    const ingredientes = document.createElement("ul");
    for (let i = 1; i <= 15; i++) {
        const ingrediente = bebida[`strIngredient${i}`]?.trim();
        if (ingrediente) {
            const medida = bebida[`strMeasure${i}`]?.trim();
            const item = document.createElement("li");
            item.textContent = medida ? `${medida} de ${ingrediente}` : ingrediente;
            ingredientes.appendChild(item);
        }
    }

    const tituloPreparacion = document.createElement("h4");
    tituloPreparacion.className = "h6";
    tituloPreparacion.textContent = "Preparación";
    const preparacion = document.createElement("p");
    preparacion.className = "instrucciones-bebida mb-0";
    preparacion.textContent = bebida.strInstructionsES || bebida.strInstructions || "Preparación no disponible.";
    if (!bebida.strInstructionsES && bebida.strInstructions) {
        preparacion.lang = "en";
    }
    informacion.append(titulo, datos, tituloIngredientes, ingredientes, tituloPreparacion, preparacion);
    fila.appendChild(informacion);
    detalle.replaceChildren(fila);
}

async function cargarDetalle(bebida, boton) {
    if (bebidaActiva) {
        bebidaActiva.classList.remove("active");
        bebidaActiva.setAttribute("aria-pressed", "false");
    }
    bebidaActiva = boton;
    boton.classList.add("active");
    boton.setAttribute("aria-pressed", "true");

    solicitudDetalle?.abort();
    const controlador = new AbortController();
    solicitudDetalle = controlador;
    detalle.replaceChildren();
    detalle.setAttribute("aria-busy", "true");
    estadoDetalle.textContent = `Cargando el detalle de ${bebida.strDrink}…`;
    try {
        const signal = AbortSignal.any([controlador.signal, AbortSignal.timeout(12000)]);
        const [resultado] = await consultarBebidas(`lookup.php?i=${encodeURIComponent(bebida.idDrink)}`, signal);
        if (!controlador.signal.aborted) {
            if (!resultado) {
                estadoDetalle.textContent = "No se encontró el detalle de esta bebida.";
                return;
            }
            mostrarDetalle(resultado);
            estadoDetalle.textContent = "";
        }
    } catch {
        if (!controlador.signal.aborted) {
            estadoDetalle.textContent = "No se pudo cargar el detalle de esta bebida.";
        }
    } finally {
        if (solicitudDetalle === controlador) {
            detalle.removeAttribute("aria-busy");
        }
    }
}

cargarListado();
