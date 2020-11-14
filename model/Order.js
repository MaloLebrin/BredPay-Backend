const mongoose = require('mongoose');

const Order = mongoose.model('Order', {
    date: {
        type: Date,
        required: true
    },
    amount: {
        type: Number,
        unique: true,
        required: true
    },
    company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Company",
    },
    products: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
    }],
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }

})
module.exports = Order;