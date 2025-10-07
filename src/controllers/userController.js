
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
    const userId = req.user?.id; // precisa de autenticação que injete o user no req
    if (!userId) {
      return res.status(401).json({ error: "Usuário não autenticado" });
    }
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
    res.status(200).json({ orders });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
