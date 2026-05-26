import { Router } from 'express';
import Detail from '../models/detail.js';
import Film from '../models/film.js';

let router = Router();

// GET /details/:id  ficha de película con comentarios
router.get('/:id', async (req, res) => {
    try {
        let film = await Film.findById(req.params.id);

        if (!film) {
            return res.render('error', { error: 'Película no encontrada' });
        }

        let comentarios = await Detail.find({ filmId: req.params.id })
                                      .sort({ fecha: -1 });

        // Formateo de la fecha de cada comentario 
        let comentariosFormateados = comentarios.map(c => {
            let fecha = new Date(c.fecha);
            let fechaFormateada = fecha.toLocaleDateString('es-ES', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            }); // resultado: DD/MM/YYYY

            // Convertimos a objeto plano para poder añadirle el campo nuevo
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


// Ruta para datos del comentario modal
router.get('/editar/:id', (req, res) => {
    Detail.findById(req.params.id).then(resultado => {
        if (resultado) {
            res.render('detail_editar', { detail: resultado });
        } else {
            res.render('error', { error: "Comentario no encontrado" });
        }
    }).catch(error => {
        res.render('error', { error: "Comentario no encontrado" });
    });
});

// Ruta para añadir un comentario
router.post('/nuevo/:filmId', async (req, res) => {
    try{
        let nuevoComentario = new Detail({
            filmId: req.params.filmId,
            nick: req.body.nick,
            texto: req.body.texto,
            valoracion: req.body.valoracion

        });

        await nuevoComentario.save();

        res.redirect('/details/' + req.params.filmId);
    } catch(error){
        let errores = error.errors ? Object.keys(error.errors) : [];
        let mensaje = '';

        if (errores.length > 0){
            errores.forEach(clave => {
                mensaje += '<p>' + error.errors[clave].message + '</p>';
            });
        } else{
            mensaje = 'Ha habido un error al añadir el comentario';
        }
        res.render('error', { error: mensaje });
    }
});


// Ruta para editar comentarios
router.put('/:id', (req, res) => {
    Detail.findByIdAndUpdate(req.params.id, {
        $set: {
            texto: req.body.texto,
            valoracion: req.body.valoracion   
        }
    }, {new: true}).then(resultado => {
        res.redirect(req.baseUrl);
    }).catch(error => {
        res.render('error', {error: "Error modificando comentario"});
    });
});


// Ruta para borrar comentarios 
router.delete('/:id', (req, res) => {
    Detail.findByIdAndDelete(req.params.id).then(resultado => {
        res.redirect('back');
    }).catch(error => {
        res.render('error', {error: "Error borrando comentario"});
    });
});

export default router;