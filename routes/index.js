// routes/index.js
const express = require('express');
const router = express.Router();

// Importar todas las rutas
const tripRoutes = require('./trips');
// const userRoutes = require('./users');
// const notificationRoutes = require('./notifications');
// ... otros archivos de rutas

// Usar las rutas
router.use('/', tripRoutes);
// router.use('/', userRoutes);
// router.use('/', notificationRoutes);
// ... añadir otros routers

module.exports = router;