const buscador = document.getElementById('titulo');
const filtros = {
    'anyo': document.getElementById('anyo'),
    'director': document.getElementById('director'),
    'orden': document.getElementById('orden')
}

buscador.addEventListener('change', (event) => {
    console.log(event)
})