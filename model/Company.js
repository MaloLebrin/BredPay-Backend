const mongoose = require('mongoose');

const Company = mongoose.model('Company', {
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    hash: {
        type: String,
        unique: true
    },
    salt: {
        type: String,
        unique: true
    },
    token: {
        type: String,
        unique: true
    },

    account: {
        username: {
            type: String,
            required: true,
            unique: true
        },
        firstname: String,
        lastname: String,
    },
    description: String,
    phone: String,
    address: {
        type: String,
        required: true
    },
    postalCode: Number,
    city: String,
    country: String,
    location: {
        type: [Number], // Longitude et latitude
        index: "2d" // Créer un index geospatial https://docs.mongodb.com/manual/core/2d/
    },
    openingHours: {
        monday: {
            beginHours: String,
            endHours: String
        },
        tuesday: {
            beginHours: String,
            endHours: String
        },
        wednesday: {
            beginHours: String,
            endHours: String
        },
        thursday: {
            beginHours: String,
            endHours: String
        },
        friday: {
            beginHours: String,
            endHours: String
        },
        saturday: {
            beginHours: String,
            endHours: String
        },
        sunday: {
            beginHours: String,
            endHours: String
        },
    },
    photo: [Object],
    products: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "product",
    }],
    orders: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "order"
        }
    ]
})
module.exports = Company;