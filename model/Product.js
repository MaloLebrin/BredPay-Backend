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
    allergens: String, //peut être en faire une table
    cut: Boolean,
    photo: [Object],
    company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Company",
    }
})
module.exports = Product;