import express from 'express';
const router = express.Router();
import multer from 'multer';

// Import model Product
import Product from '../models/product';

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
router.post('/new-product', upload.array('fotos', 4), async (req, res) => {
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
        return res.status(500).json({
            mensaje: 'Ocurrió un error al crear el producto',
            error: error.message || error
        });
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
router.delete('/product/:id', async (req, res) => {
    const _id = req.params.id;
    try {
        const productDB = await Product.findByIdAndDelete(_id);
        if (!productDB) {
            return res.status(404).json({
                mensaje: 'No se encontró el producto indicado'
            });
        }
        res.json({ mensaje: 'Producto eliminado con éxito' });
    } catch (error) {
        return res.status(400).json({
            mensaje: 'Ocurrió un error al eliminar el producto',
            error: error.message || error
        });
    }
});

// Update product
router.put('/product/:id', upload.array('fotos', 4), async (req, res) => {
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
        return res.status(400).json({
            mensaje: 'Ocurrió un error al actualizar el producto',
            error: error.message || error
        });
    }
});

// Export configuration App express
module.exports = router;
