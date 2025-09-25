const { createUser, getUsers } = require('../models/userModel');

// cadastro
exports.registerUser = (req, res) => {
  const { name, email, password } = req.body;

  // verificar se os dados foram enviados
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
  }

  // tenta criar o usuário
  const result = createUser({ name, email, password });

  // se houver erro ao criar o usuário (ex: email já está cadastrado)
  if (result.error) {
    return res.status(409).json({ error: result.error });
  }

  // resposta de sucesso
  res.status(201).json({ message: 'Usuário criado com sucesso', user: result });
};

// login
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
