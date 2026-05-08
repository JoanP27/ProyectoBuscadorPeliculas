import mongoose from 'mongoose';

let detailSchema = new mongoose.Schema({

    filmId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'film',
        required: true
    },
    nick: {
        type: String,
        required: true,
        minlength: 3,
        trim: 3
    },
    texto: {
        type: String,
        required: true,
        minlength: 2,
        trim: true
    },
    valoracion:{
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    fecha:{
        type: Date,
        default: Date.now
    }
});

let Detail = mongoose.model('detail', detailSchema);

export default Detail;