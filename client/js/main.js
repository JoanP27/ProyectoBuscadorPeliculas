import '../css/app.css';
import './buscador_peliculas'


const buscador = document.getElementById('titulo');
const filtros = {
    'anyo': document.getElementById('anyo'),
    'director': document.getElementById('director'),
    'orden': document.getElementById('orden')
}
const listadoElemento = document.getElementById('listadoPeliculas')

const listado = Array.from(listadoElemento.children)

const filtrar = () => {
    var listaFiltrada = listado.filter(l => {
        const title = l.children[0];
        const anyo = l.children[2].children[1].firstElementChild.lastElementChild
        const director = l.children[2].children[2].firstElementChild.lastElementChild

        console.log(title.textContent.toLocaleLowerCase().includes(buscador.value.toLocaleLowerCase()), anyo.textContent === filtros['anyo'].value)

        return title.textContent.toLocaleLowerCase().includes(buscador.value.toLocaleLowerCase()) &&
        (filtros['anyo'].value == "" || anyo.textContent === filtros['anyo'].value) &&
        (filtros['director'].value == "" || director.textContent.toLocaleLowerCase().includes(filtros['director'].value.toLocaleLowerCase()))
    }).toSorted((l1, l2) => {
        const title1 = l1.children[0];
        const title2 = l2.children[0];

    
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