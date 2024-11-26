const jwt = require("jsonwebtoken");
const User = require("../models/user");

exports.register = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const user = new User({ username, email, password });
    await user.save();
    const token = jwt.sign({ id: user._id }, "seu_secret_key_aqui", { expiresIn: "1h" });
    res.status(201).json({ message: "Usuário registrado com sucesso!", token });
  } catch (error) {
    res.status(500).json({ message: "Erro ao registrar usuário", error });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "Usuário não encontrado!" });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(400).json({ message: "Credenciais inválidas!" });

    const token = jwt.sign({ id: user._id }, "seu_secret_key_aqui", { expiresIn: "1h" });
    res.status(200).json({ message: "Login bem-sucedido!", token });
  } catch (error) {
    res.status(500).json({ message: "Erro ao fazer login", error });
  }
};
