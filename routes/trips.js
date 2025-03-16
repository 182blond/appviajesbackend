// routes/trips.js
const express = require('express');
const router = express.Router();
const Trip = require('../models/Trip');
const mongoose = require('mongoose');

// GET todos los viajes
router.get('/trips', async (req, res) => {
    try {
        const trips = await Trip.find({ status: { $ne: 'cancelled' } })
            .sort({ departureDate: 1, departureTime: 1 });
        res.status(200).json(trips);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET un viaje específico por ID
router.get('/trips/:id', async (req, res) => {
    try {
        const trip = await Trip.findById(req.params.id);
        if (!trip) return res.status(404).json({ message: 'Viaje no encontrado' });
        res.status(200).json(trip);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET buscar viajes por ubicación
router.get('/trips/search', async (req, res) => {
    try {
        const { fromPlace, toPlace, date, radius } = req.query;
        const searchRadius = parseFloat(radius) || 10; // Radio en km, por defecto 10km

        const query = { status: 'scheduled' };

        // Filtrar por lugares si se proporcionan
        if (fromPlace) {
            query['from.place'] = { $regex: fromPlace, $options: 'i' };
        }

        if (toPlace) {
            query['to.place'] = { $regex: toPlace, $options: 'i' };
        }

        // Filtrar por coordenadas si se proporcionan
        if (req.query.fromLat && req.query.fromLng) {
            // Búsqueda por proximidad al origen usando coordenadas
            // Implementación básica, en una aplicación real usarías geospatial queries de MongoDB
            const fromLat = parseFloat(req.query.fromLat);
            const fromLng = parseFloat(req.query.fromLng);

            // Puedes implementar una búsqueda más avanzada aquí
        }

        if (req.query.toLat && req.query.toLng) {
            // Búsqueda por proximidad al destino usando coordenadas
            const toLat = parseFloat(req.query.toLat);
            const toLng = parseFloat(req.query.toLng);

            // Puedes implementar una búsqueda más avanzada aquí
        }

        // Filtrar por fecha si se proporciona
        if (date) {
            const searchDate = new Date(date);
            searchDate.setHours(0, 0, 0, 0);

            const nextDay = new Date(searchDate);
            nextDay.setDate(nextDay.getDate() + 1);

            query.departureDate = {
                $gte: searchDate,
                $lt: nextDay
            };
        }

        const trips = await Trip.find(query)
            .sort({ departureTime: 1 });

        res.status(200).json(trips);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// POST crear un nuevo viaje
router.post('/trips', async (req, res) => {
    const trip = new Trip({
        driverId: req.body.driverId,
        driverName: req.body.driverName,
        from: {
            place: req.body.from.place,
            lat: req.body.from.lat,
            lng: req.body.from.lng
        },
        to: {
            place: req.body.to.place,
            lat: req.body.to.lat,
            lng: req.body.to.lng
        },
        departureDate: req.body.departureDate,
        departureTime: req.body.departureTime,
        estimatedArrivalTime: req.body.estimatedArrivalTime,
        route: req.body.route || [],
        availableSeats: req.body.availableSeats,
        pricePerSeat: req.body.pricePerSeat,
        vehicleModel: req.body.vehicleModel,
        vehicleColor: req.body.vehicleColor,
        licensePlate: req.body.licensePlate,
        preferences: req.body.preferences || {},
        description: req.body.description,
        luggageAllowed: req.body.luggageAllowed,
        maxLuggageSize: req.body.maxLuggageSize
    });

    try {
        const newTrip = await trip.save();
        res.status(201).json(newTrip);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// POST inicializar datos de ejemplo
router.post('/trips/seed', async (req, res) => {
    try {
        // Eliminar viajes existentes (opcional)
        await Trip.deleteMany({});

        // IDs de ejemplo para conductores
        const driverIds = [
            new mongoose.Types.ObjectId(),
            new mongoose.Types.ObjectId(),
            new mongoose.Types.ObjectId(),
            new mongoose.Types.ObjectId(),
            new mongoose.Types.ObjectId()
        ];

        // Crear datos de ejemplo
        const sampleTrips = [
            {
                driverId: driverIds[0],
                driverName: 'Carlos Rodríguez',
                from: {
                    place: 'Castelli',
                    lat: -36.0895596,
                    lng: -57.8019104
                },
                to: {
                    place: 'Burzaco',
                    lat: -34.8286232,
                    lng: -58.39333420000001
                },
                departureDate: new Date('2025-04-20'),
                departureTime: '08:00',
                estimatedArrivalTime: '11:30',
                availableSeats: 3,
                pricePerSeat: 250,
                vehicleModel: 'Honda Civic 2022',
                vehicleColor: 'Azul',
                licensePlate: 'ABC-123',
                preferences: {
                    smoking: false,
                    pets: false,
                    music: true,
                    conversation: 'chatty'
                },
                description: 'Viaje cómodo con aire acondicionado. Salida puntual.',
                luggageAllowed: true,
                maxLuggageSize: 'medium'
            },
            {
                driverId: driverIds[1],
                driverName: 'Ana Martínez',
                from: {
                    place: 'La Plata',
                    lat: -34.9204948,
                    lng: -57.9535657
                },
                to: {
                    place: 'Buenos Aires',
                    lat: -34.6036844,
                    lng: -58.3815591
                },
                departureDate: new Date('2025-04-22'),
                departureTime: '09:30',
                estimatedArrivalTime: '10:45',
                availableSeats: 4,
                pricePerSeat: 350,
                vehicleModel: 'Toyota RAV4 2023',
                vehicleColor: 'Rojo',
                licensePlate: 'XYZ-789',
                preferences: {
                    smoking: false,
                    pets: true,
                    music: true,
                    conversation: 'depends'
                },
                description: 'Viaje directo por autopista. Auto espacioso y cómodo.',
                luggageAllowed: true,
                maxLuggageSize: 'large'
            },
            {
                driverId: driverIds[2],
                driverName: 'Miguel Ángel Torres',
                from: {
                    place: 'Mar del Plata',
                    lat: -38.0054771,
                    lng: -57.5426106
                },
                to: {
                    place: 'Tandil',
                    lat: -37.3211582,
                    lng: -59.082458
                },
                departureDate: new Date('2025-04-21'),
                departureTime: '17:00',
                estimatedArrivalTime: '19:30',
                availableSeats: 2,
                pricePerSeat: 150,
                vehicleModel: 'Volkswagen Golf 2021',
                vehicleColor: 'Negro',
                licensePlate: 'MDP-456',
                preferences: {
                    smoking: false,
                    pets: false,
                    music: false,
                    conversation: 'quiet'
                },
                description: 'Viaje tranquilo después del trabajo. Prefiero poco ruido.',
                luggageAllowed: true,
                maxLuggageSize: 'small'
            },
            {
                driverId: driverIds[3],
                driverName: 'Sofía Vargas',
                from: {
                    place: 'Rosario',
                    lat: -32.9442426,
                    lng: -60.6505388
                },
                to: {
                    place: 'Córdoba',
                    lat: -31.4200833,
                    lng: -64.1887761
                },
                departureDate: new Date('2025-04-23'),
                departureTime: '06:30',
                estimatedArrivalTime: '10:30',
                availableSeats: 3,
                pricePerSeat: 400,
                vehicleModel: 'Nissan Sentra 2022',
                vehicleColor: 'Plata',
                licensePlate: 'ROS-901',
                preferences: {
                    smoking: false,
                    pets: false,
                    music: true,
                    conversation: 'chatty'
                },
                description: 'Viaje matutino. Café gratis para todos.',
                luggageAllowed: true,
                maxLuggageSize: 'medium'
            },
            {
                driverId: driverIds[4],
                driverName: 'Roberto Gómez',
                from: {
                    place: 'Castelli',
                    lat: -36.0895596,
                    lng: -57.8019104
                },
                to: {
                    place: 'Capital Federal',
                    lat: -34.6036844,
                    lng: -58.3815591
                },
                departureDate: new Date('2025-04-25'),
                departureTime: '10:00',
                estimatedArrivalTime: '14:00',
                availableSeats: 4,
                pricePerSeat: 300,
                vehicleModel: 'Mazda CX-5 2023',
                vehicleColor: 'Blanco',
                licensePlate: 'BA-567',
                preferences: {
                    smoking: false,
                    pets: true,
                    music: true,
                    conversation: 'depends'
                },
                description: 'Viaje directo con una parada para estirar las piernas.',
                luggageAllowed: true,
                maxLuggageSize: 'large'
            }
        ];

        // Insertar los datos
        const result = await Trip.insertMany(sampleTrips);

        // Responder con los datos insertados
        res.status(201).json({
            message: 'Datos de viajes inicializados correctamente',
            count: result.length,
            trips: result
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Otras rutas (actualizar, eliminar, reservar, etc.)...

module.exports = router;