import { Router } from 'express';
import Detail from '../models/detail.js';

let router = Router();

router.post('filmId', async (req, res) => {
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

export default router;