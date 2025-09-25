const { createUser, getUsers } = require('../models/userModel');

// Cadastro
exports.registerUser = (req, res) => {
  const { name, email, password } = req.body;

  // Verificar se os dados foram enviados
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
  }

  // Tenta criar o usuário
  const result = createUser({ name, email, password });

  // Se houver erro ao criar o usuário (ex: email já cadastrado)
  if (result.error) {
    return res.status(409).json({ error: result.error });
  }

  // Resposta de sucesso
  res.status(201).json({ message: 'Usuário criado com sucesso', user: result });
};

// Login
exports.loginUser = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email e senha são obrigatórios' });
  }

  const user = getUsers().find(u => u.email === email && u.password === password);

  if (!user) {
    return res.status(401).json({ error: 'Email ou senha incorretos' });
  }

  res.status(200).json({ message: 'Login bem-sucedido', user });
};
