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
        required: [true, 'Nombre obligatorio'],
        match: [/^[a-zA-Z0-9.\_\-\+\[\]]+(?:\s[a-zA-Z0-9.\_\-\+\[\]]+)*$/, 'El nombre solo puede contener letras y números']
    },
    precio: {
        type: Number,
        required: [true, 'Precio obligatorio']
    },
    stock: {
        type: Number,
        required: [true, 'Stock obligatorio']
    },
    categoria: {
        type: String,
        required: [true, 'Categoria obligatorio'],
        match: [/^[a-zA-Z]+(?:\s[a-zA-Z]+)*$/, 'La categoría solo puede contener letras']
    },
    fotos: {
        type: [String],
        default: [
            'uploads/default1.jpg',
            'uploads/default1.jpg',
            'uploads/default1.jpg',
            'uploads/default1.jpg']
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

// Convert to modelo
const Product = mongoose.model('Product', productSchema);

export default Product;