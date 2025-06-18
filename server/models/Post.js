const mongoose = require('mongoose');
const { nanoid } = require('nanoid');

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Post title is required'],
    trim: true,
  },
  body: {
    type: String,
    required: [true, 'Post body is required'],
  },
  slug: {
    type: String,
    unique: true,
    default: () => nanoid(6), 
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true, 
  },
  thumbnail: {
    type: String,
    default: "", 
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Post', postSchema);
