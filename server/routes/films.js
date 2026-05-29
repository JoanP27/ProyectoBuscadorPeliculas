import { Router } from 'express';
import Film from '../models/film.js';
import Detail from '../models/detail.js';
import { protegerRuta } from '../auth/auth.js';

let router = Router();

// let players = {};


// const ADMIN = ["admin"];
// const ANY = ["admin"];


//----------------------GET-----------------------------

// devuelve un listado con todos las peliculas registradas en la base de datos.
// /film
router.get('/', async (req, res) => {

    // Los parametros de busqueda
    const params = {...req.query};

    const limite = params.max_resultados ? params.max_resultados : 10
    const pagina = params.paginaABuscar ? params.paginaABuscar - 1 : 0

    let filtros = {
        titulo: { $regex: params.titulo ?? '', $options: 'i' },
        director:  { $regex: params.director ?? '', $options: 'i' }
    }

    if(params.anyo && params.anyo != '') {
        filtros = {
            ...filtros, 
            anyo: params.anyo
        }
    }

    console.log(filtros)

    const orden = params.orden === 'asc' ? 
            1 :
           -1;

    try {
        let films = await Film.find(filtros).sort({titulo: orden}).skip(limite * pagina).limit(limite);

        // Saca el total de peliculas filtradas
        const totalPeliculasFiltradas = await Film.countDocuments(filtros);

        // Obtiene el total de peliculas de la base de datos
        const totalPeliculas = await Film.countDocuments();

        // Redondeamos hacia arriba el resultado del numero de paginas
        const totalPaginas = Math.ceil(totalPeliculasFiltradas / limite)

        // Para cada película calculamos su valoración media
        let filmsConMedia = await Promise.all(films.map(async film => {
            let comentarios = await Detail.find({ filmId: film._id });
            let mediaValoracion = 0;
            if (comentarios.length > 0) {
                let suma = comentarios.reduce((acc, c) => acc + c.valoracion, 0);
                mediaValoracion = (suma / comentarios.length).toFixed(1);
            }
            let obj = film.toObject();
            obj.mediaValoracion = mediaValoracion;
            return obj;
        }));

        console.log(pagina)

        res.render('film_listado', {films: filmsConMedia, params: params,
            page: pagina,
            totalFoundFilms: totalPeliculasFiltradas,
            limit: limite,
            totalFilms: totalPeliculas,
            totalPages: totalPaginas
        });
    } catch(error) {
        res.render('error', { error: "Error listando películas" });
    }
});

// Formulario de alta de pelicula
router.get('/nuevo', (req, res) => {
    res.render('films_nuevo');
});

//routa editar
router.get('/editar/:id', (req, res) => {
    Film.findById(req.params['id']).then(resultado => {
        if (resultado) {
            res.render('films_editar', {film: resultado});
        } else {
            res.render('error', {error: "Pelicula no encontrada"});
        }
    }).catch(error => {
        res.render('error', {error: "Pelicula no encontrado"});
    });
});


//buscar id
router.get('/:id', async(req, res) => {
    try {
        let film = await Film.findById(req.params.id);

        if (!film) {
            return res.render('error', { error: 'Película no encontrada' });
        }

        let comentarios = await Detail.find({ filmId: req.params.id })
                                      .sort({ fecha: -1 });

        let comentariosFormateados = comentarios.map(c => {
            let fecha = new Date(c.fecha);
            let fechaFormateada = fecha.toLocaleDateString('es-ES', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            });
            let obj = c.toObject();
            obj.fechaFormateada = fechaFormateada;
            return obj;
        });

        let mediaValoracion = 0;
        if (comentarios.length > 0) {
            let suma = comentarios.reduce((acc, c) => acc + c.valoracion, 0);
            mediaValoracion = (suma / comentarios.length).toFixed(1);
        }

        let todasFilms = await Film.find({ _id: { $ne: req.params.id } });
        let recomendaciones = todasFilms
            .sort(() => 0.5 - Math.random())
            .slice(0, 3);

        res.render('films_ficha', {
            film,
            comentarios: comentariosFormateados,
            mediaValoracion,
            recomendaciones,
            cart: req.session.cart || []
        });

    } catch (error) {
        res.render('error', { error: 'Error buscando la película' });
    }
});


//----------------------POST-----------------------------
//crea una nueva pelicula en la base de datos a partir de los datos
// enviados en el cuerpo de la petición (body) en formato JSON

router.post('/', async (req, res) => {

    let nuevaFilm = new Film({
        titulo: req.body.titulo,
        director: req.body.director,
        anyo: req.body.anyo,
        sinopsis: req.body.sinopsis,
        genero: req.body.genero,
        imagen: req.body.imagen
    });

    console.log(nuevaFilm)

    nuevaFilm.save().then(resultado => {
        res.redirect(req.baseUrl);
    }).catch(error => {
        let errores = Object.keys(error.errors);
        let mensaje = "";
        if(errores.length > 0)
        {
            errores.forEach(clave => {
                mensaje += '<p>' + error.errors[clave].message + '</p>';
            })
        }
        else
        {
            mensaje = 'Error añadiendo pelicula';
        }
        console.log();
        res.render('error', {error: mensaje});
    });
});

//----------------------PUT-----------------------------
//actualiza la información de una pelicula existente en la base de datos a partir del
// identificador (id) incluido en la URL y de los nuevos datos enviados en el cuerpo de la petición (body) en
// formato JSON

router.put('/:id', (req, res) => {
    Film.findByIdAndUpdate(req.params.id, {
        $set: {
            titulo: req.body.titulo,
            director: req.body.director,
            anyo: req.body.anyo,
            sinopsis: req.body.sinopsis,
            genero: req.body.genero,
            imagen: req.body.imagen
        }
    }, {new: true}).then(resultado => {
        res.redirect(req.baseUrl);
    }).catch(error => {
        res.render('error', {error: "Error modificando pelicula"});
    });
});


//----------------------Delete-----------------------------
//elimina una pelicula de la base de datos a partir del identificador (id) especificado en la URL.
// Ruta para borrar peliculas
router.delete('/:id', (req, res) => {
    Film.findByIdAndDelete(req.params.id).then(resultado => {
        res.redirect(req.baseUrl);
    }).catch(error => {
        res.render('error', {error: "Error borrando pelicula"});
    });
});

export default router;