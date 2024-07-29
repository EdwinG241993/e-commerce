import express from 'express';
import multer from 'multer';
import Product from '../models/product';

const router = express.Router();
const fs = require('fs');
const path = require('path');
const { verificarAuth, verificaRol } = require('../middlewares/autenticacion.js');
const uploadsDir = path.resolve(__dirname, '../');

// Configure multer file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // Max file size: 5MB
        files: 4 // Max number of files
    },
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(file.originalname.toLowerCase());

        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('Solo se permiten archivos de imagen (jpeg, jpg, png)'));
        }
    }
});

// Add producto
router.post('/new-product', [verificarAuth, verificaRol], upload.array('fotos', 4), async (req, res) => {
    const body = req.body;
    const files = req.files;

    if (files && files.length > 0) {
        const fotos = files.map(file => file.path);
        body.fotos = fotos;
    }

    try {
        const productDB = await Product.create(body);
        res.status(200).json(productDB);
    } catch (error) {
        console.log(error);
        if (error.name === 'ValidationError') {
            const validationErrors = {};
            for (let field in error.errors) {
                validationErrors[field] = error.errors[field].message;
            }
            res.status(400).send({ errors: validationErrors });
        } else {
            res.status(500).send({ message: 'Error al crear el producto' });
        }
    }
});

// Get product ID
router.get('/product/:id', async (req, res) => {
    const _id = req.params.id;
    try {
        const productDB = await Product.findOne({ _id });
        if (!productDB) {
            return res.status(404).json({
                mensaje: 'No se encontró el producto indicado'
            });
        }
        res.json(productDB);
    } catch (error) {
        return res.status(400).json({
            mensaje: 'Ocurrió un error al buscar el producto',
            error: error.message || error
        });
    }
});

// Get all products
router.get('/product', async (req, res) => {
    try {
        const productDB = await Product.find();
        res.json(productDB);
    } catch (error) {
        return res.status(400).json({
            mensaje: 'Ocurrió un error al obtener los productos',
            error: error.message || error
        });
    }
});

// Delete product
router.delete('/product/:id', [verificarAuth, verificaRol], async (req, res) => {
    const _id = req.params.id;
    console.log(_id);
    try {
        const productDB = await Product.findById(_id);

        if (!productDB) {
            return res.status(404).json({
                mensaje: 'No se encontró el producto indicado'
            });
        }
        console.log(productDB.fotos);
        // Elimina los archivos asociados
        if (productDB.fotos && productDB.fotos.length > 0 && productDB.fotos[0] != 'uploads/default1.jpg') {
            productDB.fotos.forEach(foto => {
                const filePath = path.join(uploadsDir, foto);
                fs.unlink(filePath, (err) => {
                    if (err) {
                        console.error(`Error al eliminar el archivo ${foto}:`, err);
                    } else {
                        console.log(`Archivo ${foto} eliminado con éxito.`);
                    }
                });
            });
        }

        await Product.findByIdAndDelete(_id);

        res.json({ mensaje: 'Producto eliminado con éxito' });
    } catch (error) {
        return res.status(400).json({
            mensaje: 'Ocurrió un error al eliminar el producto',
            error: error.message || error
        });
    }
});

// Update product
router.put('/product/:id', [verificarAuth, verificaRol], upload.array('fotos', 4), async (req, res) => {
    const _id = req.params.id;
    const body = req.body;
    const files = req.files;

    if (files && files.length > 0) {
        const fotos = files.map(file => file.path);
        body.fotos = fotos;
    }

    try {
        const productDB = await Product.findByIdAndUpdate(
            _id,
            body,
            { new: true, runValidators: true }
        );
        if (!productDB) {
            return res.status(404).json({
                mensaje: 'No se encontró el producto indicado'
            });
        }
        console.log(productDB);
        res.json(productDB);
    } catch (error) {
        if (error.name === 'ValidationError') {
            const validationErrors = {};
            for (let field in error.errors) {
                validationErrors[field] = error.errors[field].message;
            }
            res.status(400).send({ errors: validationErrors });
        } else {
            res.status(500).send({ message: 'Error al actualizar el producto' });
        }
    }
});

// Export configuration App express
module.exports = router;
