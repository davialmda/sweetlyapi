// Rotas de autenticação (cadastro e login).
const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../controllers/userController');

// Cadastro
router.post('/register', registerUser);

// Login
router.post('/login', loginUser);

module.exports = router;
