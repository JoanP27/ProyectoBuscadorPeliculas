import { Router } from 'express';
import Film from '../models/film.js';

let router = Router();

router.get('/', (req,res) =>{
    let cart = req.session.cart || [];
    res.render('cart', { cart });
});

router.post('/anyadir/:id', async (req,res) => {

    try{
        let film = await Film.findById(req.params.id);

        if(!film){
            return res.render('error', { error: 'Pelicula no encontrada'});
        }

        if (!req.session.cart){
            req.session.cart = [];
        }

        let itExists =  req.session.cart.find(f => f.id === film.id.toString());
    
        // Añade al carrito si no existe
        if (!itExists){
            req.session.cart.push({
                id: film.id.toString(),
                titulo: film.titulo,
                director: film.director,
                genero: film.genero,
                anyo: film.anyo,
                imagen: film.imagen


            });
        }

         // Volvemos a la ficha de la película
        res.redirect('/films/' + req.params.id);

    } catch (error) {
        res.render('error', { error: 'Error añadiendo al carrito' });
    }
});

// Eliminar una película del carrito
router.delete('/:id', (req, res) => {
    if (req.session.cart) {
        req.session.cart = req.session.cart.filter(
            f => f.id !== req.params.id
        );
    }
    res.redirect('/cart');
});

export default router;