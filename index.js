// Express import
const express = require('express');

// Creating an instance of Express
const app = express();

// Importing the Express router
const router = express.Router();

// Port on which the server will listen
const port = 3000;


const mongoose = require('mongoose');


// Setting the database connection URL.
// If a DB_URL environment variable exists, we use it; otherwise, we use a local connection string.
const DB_URL = process.env.DB_URL || 'mongodb://localhost:27017/mi_base_de_datos';

// Connecting to the MongoDB database using Mongoose.
// We use useNewUrlParser and useUnifiedTopology to avoid deprecation warnings.
mongoose.connect(DB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        // If the connection is successful, we display a success 
        console.log("Conexión a la base de datos exitosa");
    })
    .catch((error) => {
        // If there is an error connecting, we display an error message with the error description.
        console.error("Error al conectar a la base de datos:", error);
    });


// Express server initialization
app.listen(port, () => {
    // Print a message to the console when the server initializes successfully
    console.log(`Servidor escuchando en el puerto ${port}`);
});