const mongoose = require('mongoose');

const Product = mongoose.model('Product', {
    productName: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    weight: Number,
    description: String,
    allergens: String,
    cut: Boolean,
    photo: [Object],
    boulangerie: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "boulangerie",
    }
})
module.exports = Product;