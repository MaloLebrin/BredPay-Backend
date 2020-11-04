const mongoose = require('mongoose');

const Boulangerie = mongoose.model('Boulangerie', {
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    adresses: {
        type: String,
        required: true
    },
    postalCode: Number,
    city: String,
    country: String,
    hours: {
        monday: String,
        tuesday: String,
        wednesday: String,
        thursday: String,
        friday: String,
        saturday: String,
        sunday: String,
    },
    products : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "product",
    }
})
module.exports = Boulangerie;