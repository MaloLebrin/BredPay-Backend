const mongoose = require('mongoose');

const User = mongoose.model('User', {
    email: {
        type: String,
        required: true,
        unique: true
    },
    token: String,
    hash: String,
    salt: String,
    account: {
        username: {
            type: String,
            required: true,
            unique: true
        },
        firstname: String,
        lastname: String,
    },
    phone: String
});
module.exports = User;