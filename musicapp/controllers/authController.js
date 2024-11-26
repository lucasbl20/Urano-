const jwt = require("jsonwebtoken");
const User = require("../models/User"); // Supondo que você tenha um modelo de usuário

// Função de registro
const register = async (req, res) => {
  const { username, email, password } = req.body;

  // Verifique se o usuário já existe no banco de dados
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Usuário já existe!" });
    }

    // Crie o novo usuário
    const user = new User({ username, email, password });
    await user.save();

    res.status(201).json({ message: "Usuário registrado com sucesso!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao processar o registro" });
  }
};

// Função de login
const login = async (req, res) => {
  const { email, password } = req.body;

  // Verifique se o usuário existe no banco de dados
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Usuário não encontrado" });
    }

    // Verifique a senha
    const isMatch = await user.comparePassword(password); // Supondo que você tenha esse método no modelo
    if (!isMatch) {
      return res.status(400).json({ message: "Senha incorreta" });
    }

    // Gerar o token
    const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "1h" });

    // Retorna o token para o cliente
    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao processar o login" });
  }
};

module.exports = { register, login };
