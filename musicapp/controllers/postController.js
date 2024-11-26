const Post = require("../models/post");

exports.createPost = async (req, res) => {
  const { title, artist, description, musicLink } = req.body;
  const userId = req.user.id;

  try {
    const newPost = new Post({ title, artist, description, musicLink, userId });
    await newPost.save();
    res.status(201).json({ message: "Post criado com sucesso!", post: newPost });
  } catch (error) {
    res.status(500).json({ message: "Erro ao criar o post.", error });
  }
};

exports.getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find();
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar posts." });
  }
};

exports.updatePost = async (req, res) => {
  const { id } = req.params;
  const { title, artist, description, musicLink } = req.body;

  try {
    const post = await Post.findById(id);
    if (!post) return res.status(404).json({ message: "Post não encontrado." });

    if (post.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Você não tem permissão para editar este post." });
    }

    post.title = title || post.title;
    post.artist = artist || post.artist;
    post.description = description || post.description;
    post.musicLink = musicLink || post.musicLink;

    await post.save();
    res.status(200).json({ message: "Post atualizado com sucesso!", post });
  } catch (error) {
    res.status(500).json({ message: "Erro ao editar post." });
  }
};

exports.deletePost = async (req, res) => {
  const { id } = req.params;

  try {
    const post = await Post.findById(id);
    if (!post) return res.status(404).json({ message: "Post não encontrado." });

    if (post.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Você não tem permissão para excluir este post." });
    }

    await post.delete();
    res.status(200).json({ message: "Post excluído com sucesso!" });
  } catch (error) {
    res.status(500).json({ message: "Erro ao excluir post." });
  }
};
