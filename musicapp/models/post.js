const mongoose = require('mongoose');

// Definição do esquema para a coleção de posts
const postSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  content: { 
    type: String, 
    required: true 
  },
  mediaUrl: { 
    type: String 
  },
  type: { 
    type: String, 
    enum: ['music', 'text', 'image'], 
    required: true 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  likes: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  }],
  comments: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Comment' 
  }]
});

// Criação do modelo de Post
const Post = mongoose.model('Post', postSchema);

module.exports = Post;
