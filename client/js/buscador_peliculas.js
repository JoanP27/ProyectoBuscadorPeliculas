
const buscador = document.getElementById('titulo');
const formulario = document.getElementById('formulario-buscador')
const filtros = {
    'anyo': document.getElementById('anyo'),
    'director': document.getElementById('director'),
    'orden': document.getElementById('orden')
}
const listadoElemento = document.getElementById('listadoPeliculas')
const paginaABuscar = document.getElementById('paginaABuscar');
const listado = Array.from(listadoElemento.children)
const botonesPagina = document.getElementsByClassName('boton-pagina');

const botonPaginaSiguiente = document.getElementsByClassName('boton-pagina-siguiente')[0];
const botonPaginaAnterior = document.getElementsByClassName('boton-pagina-anterior')[0];


Array.from(botonesPagina).forEach((boton => {
    boton.addEventListener('click', () => {
        const numero = boton.textContent
        paginaABuscar.value = numero
        formulario.submit()
    })
}))

botonPaginaSiguiente.addEventListener('click', () => {
    const paginaActual = Number.parseInt(paginaABuscar.value)
    paginaABuscar.value = paginaActual + 1
    formulario.submit()
})

botonPaginaAnterior.addEventListener('click', () => {
    const paginaActual = Number.parseInt(paginaABuscar.value)
    paginaABuscar.value = paginaActual - 1
    formulario.submit()
})

const filtrar = () => {
    var listaFiltrada = listado.filter(l => {
        const title = l.getElementsByClassName('titulo')[0];
        const anyo = l.getElementsByClassName('anyo')[0];
        const director = l.getElementsByClassName('director')[0];

        console.log(title.textContent.toLocaleLowerCase().includes(buscador.value.toLocaleLowerCase()), anyo.textContent === filtros['anyo'].value)

        return title.textContent.toLocaleLowerCase().includes(buscador.value.toLocaleLowerCase()) &&
        (filtros['anyo'].value == "" || anyo.textContent === filtros['anyo'].value) &&
        (filtros['director'].value == "" || director.textContent.toLocaleLowerCase().includes(filtros['director'].value.toLocaleLowerCase()))
    }).toSorted((l1, l2) => {
        const title1 = l1.getElementsByClassName('titulo')[0];
        const title2 = l2.getElementsByClassName('titulo')[0];

    
        return filtros['orden'].value == 'asc' ? title1.textContent.localeCompare(title2.textContent) : title2.textContent.localeCompare(title1.textContent)
    });
    listadoElemento.innerHTML = ""
    listaFiltrada.forEach(l => listadoElemento.appendChild(l))
} 


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