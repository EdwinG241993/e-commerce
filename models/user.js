import mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

const Schema = mongoose.Schema;

// Roles
const roles = {
    values: ['ADMIN', 'CLIENT'],
    message: '{VALUE} no es un rol válido'
}

const userSchema = new Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es necesario'],
        match: [/^[a-zA-Z]+(?:\s[a-zA-Z]+)*$/, 'El nombre solo puede contener letras']
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'EL email es necesario'],
        match: [/\S+@\S+\.\S+/, 'El email no es válido']
    },
    pass: {
        type: String,
        required: [true, 'La contraseña es necesaria'],
        validate: {
            validator: function (v) {
                return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/.test(v);
            },
            message: props => 'La contraseña debe tener al menos 8 caracteres, incluyendo una letra mayúscula, una letra minúscula, un número y un carácter especial.'
        }
    },
    date: {
        type: Date,
        default: Date.now
    },
    role: {
        type: String,
        default: 'CLIENT',
        enum: roles
    },
    activo: {
        type: Boolean,
        default: true
    }
});

// Validator
userSchema.plugin(uniqueValidator, { message: 'Error, esperaba {PATH} único.' });

// Remove JSON response pass
userSchema.methods.toJSON = function () {
    var obj = this.toObject();
    delete obj.pass;
    return obj;
}

// Convert to modelo
const User = mongoose.model('User', userSchema);

export default User;