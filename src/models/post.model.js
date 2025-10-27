
const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'El título es requerido'],
    trim: true
  },
  cat: {
    type: String,
    required: [true, 'La categoría es requerida'],
    trim: true
  },
  excerpt: {
    type: String,
    required: [true, 'El extracto es requerido'],
    trim: true
  },
  author: {
    type: String,
    default: 'Saúl Turbi',
    trim: true
  },
  date: {
    type: String,
    required: true
  },
  read: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: [true, 'El contenido es requerido']
  },
  imageUrl: {
    type: String,
    default: ''
  },
  videoUrl: {
    type: String,
    default: ''
  },
  likes: {
    type: Number,
    default: 0
  },
  views: {
    type: Number,
    default: 0
  },
  comments: [{
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    text: {
      type: String,
      required: true
    },
    likes: {
      type: Number,
      default: 0
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Post', postSchema);