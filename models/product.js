import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const productSchema = new Schema({
    codigo: {
        type: String,
        unique: true,
        required: [true, 'Código obligatorio'],
        match: [/^[a-zA-Z0-9-]+$/, 'El código solo puede contener números, letras y guiones (-)']
    },
    nombre: {
        type: String,
        match: [/^[a-zA-Z0-9]+(?:\s[a-zA-Z0-9]+)*$/, 'El nombre solo puede contener letras y números']
    },
    precio: {
        type: Number,
        required: [true, 'El precio es obligatorio']
    },
    categoria: {
        type: String,
        match: [/^[a-zA-Z]+(?:\s[a-zA-Z]+)*$/, 'La categoría solo puede contener letras']
    },
    fotos: {
        type: [String],
        default: [
            'uploads/default1.jpg',
            'uploads/default2.jpg',
            'uploads/default3.jpg',
            'uploads/default4.jpg']
    },
    date: {
        type: Date,
        default: Date.now
    },
    activo: {
        type: Boolean,
        default: true
    },
});

// Convert a modelo
const Product = mongoose.model('Product', productSchema);

export default Product;