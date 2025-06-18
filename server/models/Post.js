const mongoose = require('mongoose')
import { nanoid } from 'nanoid'

const Post = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        unique: true,
        default: () => nanoid(6)
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('Post', Post)