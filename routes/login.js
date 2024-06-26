import User from '../models/user';

const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

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

module.exports = router;