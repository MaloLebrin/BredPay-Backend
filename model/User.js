const mongoose = require('mongoose');

const User = mongoose.model('User', {
    email: {
        type: String,
        required: true,
        unique: true
    },
    role: {
        type: String,
        required: true
    },
    token: String,
    hash: String,
    salt: String,
    roles: [String],
    account: {
        username: {
            type: String,
            required: true,
            unique: true
        },
        firstname: String,
        lastname: String,
        address: String,
        postalCode: Number,
        city: String,
        country: String,
    },
    phone: String,
    orders: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Order"
        }
    ]
});
module.exports = User;