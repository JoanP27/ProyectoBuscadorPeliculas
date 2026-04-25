import jwt from 'jsonwebtoken';
import dotenv from "dotenv";

// Cargar variables de entorno
dotenv.config();

let generarToken = (login, rol) => jwt.sign({login: login, rol: rol}, process.env.SECRETO, {expiresIn: "2 hours"});

let validarToken = token => {
    try {
        let resultado = jwt.verify(token, process.env.SECRETO); //variable en .env
        return resultado;
    } catch (e) {}
}

let protegerRuta = roles => {
    return (req, res, next) => {
    let token = req.headers['authorization'];
    if (token) {
        token = token.substring(7);
        let resultado = validarToken(token);
        // console.log(resultado, resultado.login.rol);
        if (resultado && roles.includes(resultado.login.rol)) //ojo es login
            next();
        else
            res.status(403).json({ error: "Acceso no autorizado", result: null });
    } else 
        res.status(403).json({ok: false, error: "Usuario no autorizado"});        
    }
};

    
export {
    generarToken,
    validarToken,
    protegerRuta
};