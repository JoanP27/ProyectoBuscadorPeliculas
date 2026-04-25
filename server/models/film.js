import mongoose from 'mongoose';
/**
 *  Representa a cada pelicula
 */
let filmSchema = new mongoose.Schema({
    titulo: {
        type: String,
        required: true,
        unique: true,
        minlength: 2,
        maxlength: 255
    },
    director: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 50
    },
    anyo: {
        type: Number,
        required: true,
        min: 1800,
        max: 2100
    },
    sinopsis: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 500
    },
    genero: {
        type: String,
        required: true,
        minlength: 3,
    },
});
// Asociación con el modelo (colección contactos)
let Film = mongoose.model('film', filmSchema);

export default Film;
