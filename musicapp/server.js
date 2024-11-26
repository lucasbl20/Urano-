const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Post = require('./models/Post');
const Comment = require('./models/Comment');
const authenticateToken = require('./middlewares/authenticateToken');
const app = express();

// Configuração do middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Configuração de multer para upload de imagens
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// Conectar ao MongoDB
mongoose.connect('mongodb://localhost:27017/musicapp', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Conectado ao MongoDB'))
  .catch(err => console.error('Erro ao conectar ao MongoDB:', err));

// Rota para registro de usuário
app.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ error: 'Nome de usuário, email e senha são obrigatórios.' });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Usuário já existe.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, email, password: hashedPassword });
    await user.save();

    res.status(201).json({ message: 'Usuário registrado com sucesso.' });
  } catch (error) {
    console.error('Erro ao registrar usuário:', error);
    res.status(500).json({ error: 'Erro interno no servidor.' });
  }
});

// Rota para login de usuário
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email e senha são obrigatórios.' });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      console.error('Usuário não encontrado:', email);
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }

    // Comparação de senha
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.error('Senha incorreta para o email:', email);
      return res.status(400).json({ error: 'Senha incorreta.' });
    }

    // Gerar token
    const token = jwt.sign({ userId: user._id }, 'secreta_chave', { expiresIn: '1h' });

    // Enviar informações completas do usuário
    res.status(200).json({
      token,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    console.error('Erro ao fazer login:', error);
    res.status(500).json({ error: 'Erro interno no servidor.' });
  }
});

// Rota para criação de postagens
app.post('/posts', authenticateToken, multer().single('image'), async (req, res) => {
  const { userId, content, type } = req.body;

  if (!userId || !content || !type) {
    return res.status(400).json({ error: 'userId, content e type são obrigatórios.' });
  }

  try {
    let mediaUrl = null;
    if (req.file) {
      mediaUrl = `/uploads/${req.file.filename}`;
    }

    const post = new Post({ userId, content, mediaUrl, type });
    await post.save();

    res.status(201).json(post);
  } catch (error) {
    console.error('Erro ao criar post:', error);
    res.status(500).json({ error: 'Erro interno no servidor.' });
  }
});

// Rota para obter as postagens
app.get('/posts', authenticateToken, async (req, res) => {
  try {
    const posts = await Post.find()
      .populate('userId', 'username')
      .sort({ createdAt: -1 });

    res.status(200).json(posts);
  } catch (error) {
    console.error('Erro ao obter posts:', error);
    res.status(500).json({ error: 'Erro interno no servidor.' });
  }
});

// Rota para upload de foto de perfil
app.post('/uploadProfilePhoto', authenticateToken, upload.single('profilePhoto'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'Nenhuma foto foi enviada.' });
  }

  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }

    user.profilePhoto = `/uploads/${req.file.filename}`;
    await user.save();

    res.status(200).json({ message: 'Foto de perfil atualizada com sucesso.', imageUrl: user.profilePhoto });
  } catch (error) {
    console.error('Erro ao atualizar foto de perfil:', error);
    res.status(500).json({ error: 'Erro interno ao atualizar foto de perfil.' });
  }
});

// Rota para upload de foto de capa
app.post('/uploadCoverPhoto', authenticateToken, upload.single('coverPhoto'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'Nenhuma foto foi enviada.' });
  }

  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }

    user.coverPhoto = `/uploads/${req.file.filename}`;
    await user.save();

    res.status(200).json({ message: 'Foto de capa atualizada com sucesso.', imageUrl: user.coverPhoto });
  } catch (error) {
    console.error('Erro ao atualizar foto de capa:', error);
    res.status(500).json({ error: 'Erro interno ao atualizar foto de capa.' });
  }
});

// Middleware para autenticação de token
app.use('/profile', authenticateToken, (req, res) => {
  res.status(200).json({ message: 'Acesso ao perfil autorizado.' });
});

// Iniciar o servidor
app.listen(5000, () => {
  console.log('Servidor rodando na porta 5000');
});
