// Estructura de archivos
// /server.js - Archivo principal del servidor
// /routes/api.js - Rutas API
// /models/Item.js - Modelo de ejemplo
// /config/db.js - Configuración de base de datos

// ---- server.js ----
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const apiRoutes = require('./routes');
const dbConfig = require('./config/db');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Conectar a MongoDB
mongoose.connect(dbConfig.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => {
        console.log('Conectado a la base de datos');
    })
    .catch(err => {
        console.error('Error al conectar a la base de datos', err);
        process.exit();
    });

// Rutas
app.use('/api', apiRoutes);

// Ruta de prueba
app.get('/', (req, res) => {
    res.json({ mensaje: 'Bienvenido a la API' });
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});