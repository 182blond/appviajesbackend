// models/Trip.js
const mongoose = require('mongoose');

// Esquema para coordenadas geográficas
const LocationSchema = mongoose.Schema({
    place: {
        type: String,
        required: true
    },
    lat: {
        type: Number,
        required: true
    },
    lng: {
        type: Number,
        required: true
    }
});

// Esquema para los pasajeros de un viaje
const PassengerSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String,
        required: true
    },
    pickupLocation: {
        type: LocationSchema,
        required: true
    },
    dropoffLocation: {
        type: LocationSchema,
        required: true
    },
    bookingDate: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'cancelled'],
        default: 'pending'
    },
    price: {
        type: Number,
        required: true
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'paid', 'refunded'],
        default: 'pending'
    }
});

// Esquema principal para los viajes compartidos
const TripSchema = mongoose.Schema({
    driverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    driverName: {
        type: String,
        required: true
    },
    // Ubicación de origen con coordenadas
    from: {
        type: LocationSchema,
        required: true
    },
    // Ubicación de destino con coordenadas
    to: {
        type: LocationSchema,
        required: true
    },
    departureDate: {
        type: Date,
        required: true
    },
    departureTime: {
        type: String,
        required: true
    },
    estimatedArrivalTime: {
        type: String
    },
    // Puedes incluir paradas intermedias en la ruta
    route: {
        type: [LocationSchema],
        default: []
    },
    availableSeats: {
        type: Number,
        required: true,
        min: 1
    },
    pricePerSeat: {
        type: Number,
        required: true
    },
    vehicleModel: {
        type: String,
        required: true
    },
    vehicleColor: {
        type: String,
        required: true
    },
    licensePlate: {
        type: String,
        required: true
    },
    passengers: [PassengerSchema],
    preferences: {
        smoking: {
            type: Boolean,
            default: false
        },
        pets: {
            type: Boolean,
            default: false
        },
        music: {
            type: Boolean,
            default: true
        },
        conversation: {
            type: String,
            enum: ['quiet', 'chatty', 'depends'],
            default: 'depends'
        }
    },
    description: {
        type: String
    },
    luggageAllowed: {
        type: Boolean,
        default: true
    },
    maxLuggageSize: {
        type: String,
        enum: ['small', 'medium', 'large'],
        default: 'medium'
    },
    status: {
        type: String,
        enum: ['scheduled', 'in_progress', 'completed', 'cancelled'],
        default: 'scheduled'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Middleware pre-save para actualizar la fecha de actualización
TripSchema.pre('save', function (next) {
    this.updatedAt = new Date();
    next();
});

// Método virtual para calcular asientos ocupados
TripSchema.virtual('occupiedSeats').get(function () {
    return this.passengers.filter(passenger =>
        passenger.status === 'confirmed'
    ).length;
});

// Método virtual para calcular asientos disponibles reales
TripSchema.virtual('remainingSeats').get(function () {
    const occupiedSeats = this.passengers.filter(passenger =>
        passenger.status === 'confirmed'
    ).length;
    return this.availableSeats - occupiedSeats;
});

// Asegúrate de que las propiedades virtuales se incluyan cuando conviertas a JSON
TripSchema.set('toJSON', { virtuals: true });
TripSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Trip', TripSchema);