
const buscador = document.getElementById('titulo');
const formulario = document.getElementById('formulario-buscador')
const filtros = {
    'anyo': document.getElementById('anyo'),
    'director': document.getElementById('director'),
    'orden': document.getElementById('orden')
}
const listadoElemento = document.getElementById('listadoPeliculas')
const paginaABuscar = document.getElementById('paginaABuscar');

// Obtiene la lista de peliculas obtenido en la primera busqueda
const listado = Array.from(listadoElemento.children)
const botonesPagina = document.getElementsByClassName('boton-pagina');

const botonPaginaSiguiente = document.getElementsByClassName('boton-pagina-siguiente')[0];
const botonPaginaAnterior = document.getElementsByClassName('boton-pagina-anterior')[0];

// Se escucha a cada boton y si se hace click en alguno de ellos se cammbia el numero de pagina a cisualizar y se envia el formulario
Array.from(botonesPagina).forEach((boton => {
    boton.addEventListener('click', () => {
        const numero = boton.textContent
        paginaABuscar.value = numero
        formulario.submit()
    })
}))

// Se esucha el click del boton de siguiente y si se hace click manda el formulario con la pagina siguiente a la actual
if(botonPaginaSiguiente) {
    botonPaginaSiguiente.addEventListener('click', () => {
        const paginaActual = Number.parseInt(paginaABuscar.value)
        paginaABuscar.value = paginaActual + 1
        formulario.submit()
    });
}

// Se esucha el click del boton de siguiente y si se hace click manda el formulario con la pagina anterior a la actual
if(botonPaginaAnterior) {
    botonPaginaAnterior.addEventListener('click', () => {
        const paginaActual = Number.parseInt(paginaABuscar.value)
        paginaABuscar.value = paginaActual - 1
        formulario.submit()
    });
}

// Funcion que obtiene la lista de peliculas y le aplica los filtros de el formulario, solo los aplica con la lista mostrada actualmente no con todas las peliculas del backend
const filtrar = () => {
    var listaFiltrada = listado.filter(l => {

        // Obtiene cadadato de cada pelicula de la lista
        const title = l.getElementsByClassName('titulo')[0];
        const anyo = l.getElementsByClassName('anyo')[0];
        const director = l.getElementsByClassName('director')[0];

        // Aplica los filtros de el formulario de busqueda
        return title.textContent.toLocaleLowerCase().includes(buscador.value.toLocaleLowerCase()) &&
        (filtros['anyo'].value == "" || anyo.textContent === filtros['anyo'].value) &&
        (filtros['director'].value == "" || director.textContent.toLocaleLowerCase().includes(filtros['director'].value.toLocaleLowerCase()))
    }).toSorted((l1, l2) => {

        // Ordena la lista segun el campo de orden del formulario de busqueda
        const title1 = l1.getElementsByClassName('titulo')[0];
        const title2 = l2.getElementsByClassName('titulo')[0];
        return filtros['orden'].value == 'asc' ? title1.textContent.localeCompare(title2.textContent) : title2.textContent.localeCompare(title1.textContent)
    });

    // Elimina la lista antigua y la remplaza por la lista nueva filtrada
    listadoElemento.innerHTML = ""
    listaFiltrada.forEach(l => listadoElemento.appendChild(l))
} 

// Escucha a todos los campos del formulario de busqueda y ejecuta la funcion de filtrar si alguno de ellos cambia
buscador.addEventListener('input', (event) => {
    filtrar()
})

filtros['anyo'].addEventListener('input', (event) => {
    filtrar()
})
filtros['director'].addEventListener('input', (event) => {
    filtrar()
})
filtros['orden'].addEventListener('change', (event) => {
    filtrar()
})