const mongoose = require('mongoose');

// Definir o schema do comentário
const commentSchema = new mongoose.Schema({
  postId: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  commentContent: { type: String, required: true },
}, { timestamps: true });

// Criar e exportar o modelo Comment
const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;
