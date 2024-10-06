import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import mongoose from 'mongoose';

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

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
app.use(cors({
    origin: 'http://localhost:8080',
    credentials: true // Enable sending session cookies
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//  Session settings
app.use(session({
    secret: 'hi7823i238',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: uri,
        collectionName: 'sessions'
    }),
    cookie: {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24, // 1 day
        sameSite: 'Lax',  // Required for third-party cookies
        secure: false       // Only send cookies via HTTPS
    }
}));

// Routes
import productRoutes from './routes/product.js';
import userRoutes from './routes/user.js';
import loginRoutes from './routes/login.js';

app.use('/api', productRoutes);
app.use('/api', userRoutes);
app.use('/api', loginRoutes);

// Middleware para Vue.js router modo history
import history from 'connect-history-api-fallback';
app.use(history());
app.use(express.static(path.join(__dirname, 'public')));

app.set('puerto', process.env.PORT || 3000);
app.listen(app.get('puerto'), () => {
    console.log('App escuchando desde el puerto ' + app.get('puerto'));
});