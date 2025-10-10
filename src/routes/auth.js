const express = require('express');
const router = express.Router();
const db = require('../models/authDb');

// Endpoint para cadastro de usuário
router.post('/api/cadastro', (req, res) => {
  const { nome, email, senha } = req.body;

  if (!nome || !email || !senha) {
    return res.status(400).json({ message: 'Todos os campos são obrigatórios.' });
  }

  const query = `INSERT INTO users (nome, email, senha) VALUES (?, ?, ?)`;
  db.run(query, [nome, email, senha], function (err) {
    if (err) {
      if (err.message.includes('UNIQUE constraint failed')) {
        return res.status(400).json({ message: 'Email já cadastrado.' });
      }
      return res.status(500).json({ message: 'Erro ao cadastrar usuário.', error: err.message });
    }
    res.status(201).json({ message: 'Usuário cadastrado com sucesso!', id: this.lastID });
  });
});

// Endpoint para login de usuário
router.post('/api/login', (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ message: 'Email e senha são obrigatórios.' });
  }

  const query = `SELECT * FROM users WHERE email = ? AND senha = ?`;
  db.get(query, [email, senha], (err, user) => {
    if (err) {
      return res.status(500).json({ message: 'Erro ao realizar login.', error: err.message });
    }
    if (!user) {
      return res.status(401).json({ message: 'Email ou senha incorretos.' });
    }
    res.status(200).json({ message: 'Login realizado com sucesso!', user });
  });
});

module.exports = router;
