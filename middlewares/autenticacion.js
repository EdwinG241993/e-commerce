const jwt = require('jsonwebtoken');

let verificarAuth = (req, res, next) => {

    let token = req.get('token');

    if (req.session.userId) {
        // Read headers
        jwt.verify(token, 'secret', (err, decoded) => {
            if (err) {
                return res.status(401).json({
                    mensaje: 'Error de token',
                    err
                })
            }

            // Create a new property with user info
            req.usuario = decoded.data;
            next();

        });
    } else {
        return res.status(401).json({ mensaje: 'No Autorizado' });
    }
}

let verificaRol = (req, res, next) => {

    let rol = req.usuario.role;

    if (rol !== 'ADMIN') {
        return res.status(401).json({
            mensaje: 'Rol no autorizado!'
        })
    }
    next();
}

module.exports = { verificarAuth, verificaRol };