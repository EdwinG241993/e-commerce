import User from '../models/user';

const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { verificarAuth } = require('../middlewares/autenticacion.js');

router.post('/login', async (req, res) => {

    let body = req.body;

    try {
        // Search email in DB
        const usuarioDB = await User.findOne({ email: body.email });

        // Evaluate if the user exists in DB
        if (!usuarioDB) {
            return res.status(400).json({
                mensaje: 'Usuario! o contraseña inválidos',
            });
        }

        // Evaluate correct pass
        if (!bcrypt.compareSync(body.pass, usuarioDB.pass)) {
            return res.status(400).json({
                mensaje: 'Usuario o contraseña! inválidos',
            });
        }

        // Generate Token
        let token = jwt.sign({
            data: usuarioDB
        }, 'secret', { expiresIn: 60 * 60 * 24 * 30 }) // Expires in 30 days

        req.session.userId = usuarioDB._id;

        // Passed validations
        return res.json({
            usuarioDB,
            token: token
        })

    } catch (error) {
        return res.status(400).json({
            mensaje: 'Ocurrio un error',
            error
        });
    }

});

router.post('/logout', verificarAuth, async (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).json({ mensaje: 'Error al cerrar sesion' });
        }
        res.clearCookie('connect.sid');
        return res.status(200).json({ mensaje: 'Sesion Cerrada' });
    });
});

router.get('/profile', verificarAuth, async (req, res) => {
    if (req.session.userId) {
        return res.status(200).json({ message: `Perfil del usuario ${req.usuario._id}` });
    } else {
        return res.status(401).json({ message: 'No autorizado' });
    }
});

module.exports = router;