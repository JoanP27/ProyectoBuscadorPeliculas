import { Router } from 'express';
import Detail from '../models/detail.js';

let router = Router();

// Ruta para añadir un comentario
router.post('/nuevo/:filmId', async (req, res) => {
    try{
        let nuevoComentario = new Comentario({
            filmId: req.params.filmId,
            nick: req.body.nick,
            texto: req.body.texto,

        });

        await nuevoComentario.save();

        res.redirect('/films/' + req.params.filmId);
    } catch(error){
        let errores = error.erros ? Object.keys(error.errors) : [];
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


// Ruta para borrar comentarios 
router.delete(':filmId', (req, res) => {
    Detail.findByIdAndDelete(req.params.id).then(resultado => {
        res.redirect(req.baseUrl);
    }).catch(error => {
        res.render('error', {error: "Error borrando comentario"});
    });
});

// Ruta para editar comentarios
router.put(':filmId', (req, res) => {
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


// Formulario de edición de comentario
router.get('/editar/:filmId', (req, res) => {
    Detail.findById(req.params['filmId']).then(resultado => {
        if (resultado) {
            res.render('detail_editar', {detail: resultado});
        } else {
            res.render('error', {error: "Comentario no encontrado"});
        }
    }).catch(error => {
        res.render('error', {error: "Comentario no encontrado"});
    });
});

export default router;