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

const { createUser, getUsers } = require("../models/userModel");
const Order = require("../models/order");
const { Op } = require("sequelize");

// cadastro
exports.registerUser = (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: "Todos os campos são obrigatórios" });
  }

  const result = createUser({ name, email, password });

  if (result.error) {
    return res.status(409).json({ error: result.error });
  }

  res.status(201).json({ message: "Usuário criado com sucesso", user: result });
};

// login
exports.loginUser = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email e senha são obrigatórios" });
  }

  const user = getUsers().find(
    (u) => u.email === email && u.password === password
  );

  if (!user) {
    return res.status(401).json({ error: "Email ou senha incorretos" });
  }

  // aqui idealmente você geraria um token JWT
  res.status(200).json({ message: "Login bem-sucedido", user });
};

// listar pedidos do usuário logado
exports.getUserOrders = async (req, res) => {
  try {
    const userId = req.user.id; // precisa de autenticação que injete o user no req
    const { status, date } = req.query;

    const where = { userId };

    if (status) {
      where.status = status;
    }

    if (date) {
      const start = new Date(date);
      start.setHours(0, 0, 0, 0);

      const end = new Date(date);
      end.setHours(23, 59, 59, 999);

      where.createdAt = { [Op.between]: [start, end] };
    }

    const orders = await Order.findAll({ where });   
  }
}

const User = require("../models/user"); // importa o modelo do usuário

// Controller para listar todos os usuários
exports.getUsers = async (req, res) => {
  try {
    // busca todos os usuários cadastrados no banco
    const users = await User.findAll({
      attributes: ["id", "name", "email", "role", "createdAt"], // define o que vai ser mostrado
    });

    // retorna a lista como JSON
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar usuários: " + err.message });
  }
};

exports.listAllUsers = (req, res) => {
  try {
    const users = getUsers(); // usa a função já existente no modelo

    if (!users || users.length === 0) {
      return res.status(404).json({ message: "Nenhum usuário encontrado." });
    }

    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar usuários: " + err.message });
  }
};

