import User from '../models/user.js';
import _ from 'underscore'; // Filter PUT fields
import express from 'express';
import { verificarAuth, verificaRol } from '../middlewares/autenticacion.js';
import bcrypt from 'bcrypt'; // Hash Pass

const router = express.Router();
const saltRounds = 10;

// Add user
router.post('/new-user', async (req, res) => {
    const body = req.body;

    // Validate password before hashing
    const passwordValidationRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;
    if (!passwordValidationRegex.test(req.body.pass)) {
        return res.status(400).json({
            mensaje: 'La contraseña debe tener al menos 8 caracteres, incluyendo una letra mayúscula, una letra minúscula, un número y un carácter especial.'
        });
    }

    // If validation passes, the password is hashed.
    req.body.pass = bcrypt.hashSync(req.body.pass, saltRounds);

    try {
        const userDB = await User.create(body);
        return res.json(userDB);
    } catch (error) {
        if (error.name === 'ValidationError') {
            const validationErrors = {};
            for (let field in error.errors) {
                validationErrors[field] = error.errors[field].message;
            }
            res.status(400).send({ errors: validationErrors });
        } else {
            res.status(500).send({ message: 'Error al crear el usuario' });
        }
    }
});

/* GET users listing. */
router.get('/user', [verificarAuth, verificaRol], async (req, res, next) => {
    try {
        const userDB = await User.find();
        res.json(userDB);
    } catch (error) {
        return res.status(400).json({
            mensaje: 'Ocurrió un error al obtener los usuarios',
            error: error.message || error
        });
    }
});

// Get user ID
router.get('/user/:id', [verificarAuth, verificaRol], async (req, res) => {
    const _id = req.params.id;
    try {
        const userDB = await User.findOne({ _id });
        if (!userDB) {
            return res.status(404).json({
                mensaje: 'No se encontró el usuario indicado'
            });
        }
        res.json(userDB);
    } catch (error) {
        return res.status(400).json({
            mensaje: 'Ocurrió un error al buscar el usuario',
            error: error.message || error
        });
    }
});

// Update user ID
router.put('/user/:id', [verificarAuth, verificaRol], async (req, res) => {
    const _id = req.params.id;
    const body = _.pick(req.body, ['nombre', 'email', 'role', 'pass']);

    if (body.pass) {
        body.pass = bcrypt.hashSync(req.body.pass, saltRounds);
    }

    try {
        const userDB = await User.findByIdAndUpdate(
            _id,
            body,
            { new: true, runValidators: true }
        );
        if (!userDB) {
            return res.status(404).json({
                mensaje: 'No se encontró el usuario indicado'
            });
        }

        res.json(userDB);
    } catch (error) {
        if (error.name === 'ValidationError') {
            const validationErrors = {};
            for (let field in error.errors) {
                validationErrors[field] = error.errors[field].message;
            }
            res.status(400).send({ errors: validationErrors });
        } else {
            res.status(500).send({ message: 'Error al actualizar el usuario' });
        }
    }
});

// Delete user ID
router.delete('/user/:id', [verificarAuth, verificaRol], async (req, res) => {
    const _id = req.params.id;

    try {
        const userDB = await User.findById(_id);

        if (!userDB) {
            return res.status(404).json({
                mensaje: 'No se encontró el usuario indicado'
            });
        }

        await User.findByIdAndDelete(_id);

        res.json({ mensaje: 'Usuario eliminado con éxito' });
    } catch (error) {
        return res.status(400).json({
            mensaje: 'Ocurrió un error al eliminar el usuario',
            error: error.message || error
        });
    }
});

export default router;