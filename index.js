import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import path from 'path';
const mongoose = require('mongoose');

const app = express();

const uri = 'mongodb://localhost:27017/ecommercebd';

// Or using promises
mongoose.connect(uri).then(
    /** ready to use. The `mongoose.connect()` promise resolves to mongoose instance. */
    () => { console.log('Conectado a DB Mongoose') },
    /** handle initial connection error */
    err => { console.log(err) }
);

// Middleware
app.use(morgan('tiny'));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(express.static(path.join(__dirname, 'public')));

// Rutas
app.get('/', (req, res) => {
    res.send('Hello World!');
});
app.use('/api', require('./routes/product'));

// Middleware para Vue.js router modo history
const history = require('connect-history-api-fallback');
app.use(history());
app.use(express.static(path.join(__dirname, 'public')));

app.set('puerto', process.env.PORT || 3000);
app.listen(app.get('puerto'), () => {
    console.log('App escuchando desde el puerto ' + app.get('puerto'));
});