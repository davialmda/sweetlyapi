// Rotas de autenticação (cadastro e login).
const express = require("express");
const router = express.Router();
const { registerUser, loginUser } = require("../controllers/userController");

// Converte payloads legados (nome/senha) para o formato atual (name/password).
const normalizeCredentials = (req, _res, next) => {
  if (req.body && typeof req.body === "object") {
    if (req.body.nome && !req.body.name) {
      req.body.name = req.body.nome;
    }
    if (req.body.senha && !req.body.password) {
      req.body.password = req.body.senha;
    }
  }
  next();
};

// Cadastro
router.post("/register", registerUser);
router.post("/api/cadastro", normalizeCredentials, registerUser);

// Login
router.post("/login", loginUser);
router.post("/api/login", normalizeCredentials, loginUser);

module.exports = router;
