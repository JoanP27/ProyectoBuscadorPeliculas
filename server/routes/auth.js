const express = require('express');
const auth = require(__dirname + '/../auth/auth');

let router = express.Router();

// Importamos la librerÃ­a bcrypt en lugar del mÃ³dulo nativo crypto
const bcrypt = require('bcrypt'); 
const User = require('../models/users');
const { protegerRuta } = require('../auth/auth');

const ADMIN = ["admin"];
const ANY = ["admin"];


const { generarToken } = require('../auth/auth');

// ============================================================================
// ENDPOINT: INICIO DE SESIÃ“N (LOGIN)
// ============================================================================
router.post('/login', async (req, res) => {
    try {
        const { login, password } = req.body;

        if (!login || !password) {
            return res.status(400).json({ error: "Debe proporcionar login y password", result: null });
        }

        // 1. Buscamos al usuario en la BD ÃšNICAMENTE por su 'login'.
        // No podemos buscar por password porque bcrypt genera un hash distinto cada vez.
        const user = await User.findOne({ login: login });

        // Si el usuario no existe, devolvemos error 401.
        if (!user) {
            return res.status(401).json({ error: "Login incorrecto", result: null });
        }

        // 2. Comparamos la contraseÃ±a.
        // bcrypt.compare() toma la contraseÃ±a en texto plano (del body) y el hash (de la BD).
        // Internamente extrae el 'salt' del hash de la BD y verifica si coinciden. Es asÃ­ncrono.
        const isMatch = await bcrypt.compare(password, user.password);

        // Si isMatch es falso, la contraseÃ±a era incorrecta.
        if (!isMatch) {
            // FÃ­jate que devolvemos el mismo mensaje genÃ©rico para no dar pistas 
            // a un atacante de si fallÃ³ el usuario o la contraseÃ±a.
            return res.status(401).json({ error: "Login incorrecto", result: null });
        }

        // Si llegamos aquÃ­, las credenciales son vÃ¡lidas. Generamos el token.
        const token = generarToken(user);
        res.status(200).json({ error: null, result: token });

    } catch (err) {
        console.error("Error en login:", err);
        res.status(500).json({ error: "Error interno del servidor", result: null });
    }
});

// ============================================================================
// ENDPOINT: REGISTRO DE USUARIOS (REGISTER)
// ============================================================================
router.post('/register', async (req, res) => {
    try {
        const { login, password, rol } = req.body;

        if (!login || !password || !rol) {
            return res.status(400).json({ error: "Faltan campos obligatorios", result: null });
        }

        const existingUser = await User.findOne({ login });
        if (existingUser) {
            return res.status(400).json({ error: "El usuario ya está registrado", result: null });
        }

        // Definimos el "coste" o "salt rounds" de bcrypt. 
        // 10 es el estÃ¡ndar actual: es lo suficientemente seguro y rÃ¡pido. 
        // A mayor nÃºmero, mÃ¡s tarda en procesar (mÃ¡s seguro contra fuerza bruta, pero consume mÃ¡s CPU).
        const saltRounds = 10;

        // Encriptamos la contraseÃ±a de forma segura. 'hash' es una operaciÃ³n asÃ­ncrona.
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Guardamos el usuario con la contraseÃ±a encriptada por bcrypt.
        const newUser = new User({ login, password: hashedPassword, rol });
        await newUser.save();

        res.status(201).json({ error: null, result: "Usuario registrado con éxito" });

    } catch (err) {
        console.error("Error en registro:", err);
        res.status(500).json({ error: "Error interno del servidor", result: null });
    }
});
router.get('/', protegerRuta(ADMIN), async (req, res) => {
    try {
        const resultado = await User.find(); // Espera la respuesta de la base de datos
        
        //200 Se devuelve una lista con la información de todos los jugadores registrados.
        if (resultado.length > 0)
            return res.status(200).json({ ok: true, result: resultado });

        //404 No existen jugadores registrados en el sistema
        return res.status(404).json({
            ok: true, error: "No existen jugadores registrados en el sistema.", result: null
        });

    } catch (error) {
        //500 Error interno del servidor
        return res.status(500).json({
            ok: false, error: "Error interno del servidor.", return: null });
  }
});

module.exports = router;