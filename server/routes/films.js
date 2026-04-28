import { Router } from 'express';
import Film from '../models/film.js';
import { protegerRuta } from '../auth/auth.js';

let router = Router();

// let players = {};


// const ADMIN = ["admin"];
// const ANY = ["admin"];


//----------------------GET-----------------------------

// devuelve un listado con todos las peliculas registradas en la base de datos.
// /film
router.get('/', (req, res) => {
    Film.find().then(resultado => {
        res.render('film_listado', {film: resultado});
    }).catch(error => {
        // Aquí podríamos renderizar una página de error
    });
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

// Formulario de alta de pelicula
router.get('/nuevo', (req, res) => {
    res.render('films_nuevo');
});


//buscar id
router.get('/:id', (req, res) => {
    Film.findById(req.params['id']).then(resultado => {
        res.render('films_ficha', {film: resultado});
    }).catch(error => {
        // Aquí podríamos renderizar una página de error
    });
});

//----------------------POST-----------------------------
//crea una nueva pelicula en la base de datos a partir de los datos
// enviados en el cuerpo de la petición (body) en formato JSON

router.post('/', (req, res) => {

    let nuevaFilm = new Film({
        titulo: req.body.titulo,
        director: req.body.director,
        anyo: req.body.anyo,
        sinopsis: req.body.sinopsis,
        genero: req.body.genero
    });
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
            genero: req.body.genero
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