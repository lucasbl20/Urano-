const jwt = require("jsonwebtoken");

function authenticateToken(req, res, next) {
  // Obtém o token do cabeçalho Authorization
  const token = req.headers["authorization"] && req.headers["authorization"].split(" ")[1]; // "Bearer <token>"

  // Verifica se o token foi fornecido
  if (!token) {
    return res.status(401).json({ message: "Token não fornecido" });
  }

  // Verifica a validade do token
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Token inválido" });
    }
    req.user = user; // Adiciona o usuário decodificado ao request
    next(); // Chama o próximo middleware ou rota
  });
}

module.exports = authenticateToken;
