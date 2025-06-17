const mongoose = require('mongoose')

const User = mongoose.Schema({
    name: String,
    email: String,
    password: String,
    phoneNumber: Number,
    isAdmin: {
        type: Boolean,
        default: false
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('User', User)