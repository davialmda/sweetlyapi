<<<<<<< HEAD

const { createUser, getUsers } = require("../models/userModel");
const Order = require("../models/order");
const { Op } = require("sequelize");
=======
// Funções utilitárias que lidam com persistência e segurança de usuários.
const {
  createUser,
  findUserByEmail,
  verifyPassword,
  sanitizeUser,
} = require("../models/userModel");
>>>>>>> c096da21db9f4c7a4d22f6dca18531145b792b85

// Trata a requisição de cadastro de usuário.
exports.registerUser = async (req, res) => {
  const { name, email, password } = req.body;
<<<<<<< HEAD
  if (!name || !email || !password) {
    return res.status(400).json({ error: "Todos os campos são obrigatórios" });
  }
  const result = createUser({ name, email, password });
  if (result.error) {
    return res.status(409).json({ error: result.error });
  }
  res.status(201).json({ message: "Usuário criado com sucesso", user: result });
=======

  // Validação básica para garantir que os campos obrigatórios chegaram.
  if (!name || !email || !password) {
    return res
      .status(400)
      .json({ error: "Todos os campos sao obrigatorios" });
  }

  try {
    // Tenta criar o usuário no banco; a função já aplica hash e valida domínio.
    const result = await createUser({ name, email, password });

    if (result.error) {
      return res.status(409).json({ error: result.error });
    }

    return res.status(201).json({
      message: "Usuario criado com sucesso",
      user: result.user,
    });
  } catch (error) {
    return res.status(500).json({ error: "Erro ao criar usuario" });
  }
>>>>>>> c096da21db9f4c7a4d22f6dca18531145b792b85
};

// Controla o processo de login a partir de email e senha.
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
<<<<<<< HEAD
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
=======

  // Se faltar dado, interrompe a autenticação com erro 400.
  if (!email || !password) {
    return res
      .status(400)
      .json({ error: "Email e senha sao obrigatorios" });
  }

  try {
    // Busca o usuário normalizando o email (lowercase e trim).
    const user = await findUserByEmail(email);

    if (!user) {
      return res.status(401).json({ error: "Email ou senha incorretos" });
    }

    // Compara o hash da senha informada com o hash persistido.
    const isValid = verifyPassword(password, user.passwordSalt, user.passwordHash);

    if (!isValid) {
      return res.status(401).json({ error: "Email ou senha incorretos" });
    }

    // Retorna somente os dados públicos (sem hash e salt).
    return res.status(200).json({
      message: "Login bem-sucedido",
      user: sanitizeUser(user),
    });
  } catch (error) {
    return res.status(500).json({ error: "Erro ao realizar login" });
>>>>>>> c096da21db9f4c7a4d22f6dca18531145b792b85
  }
};

const { Op } = require("sequelize");
const Order = require("../models/order");

// Funções utilitárias que lidam com persistência e segurança de usuários.
const {
  createUser,
  findUserByEmail,
  verifyPassword,
  sanitizeUser,
  findUserById,
} = require("../models/userModel");

// Trata a requisição de cadastro de usuário.
exports.registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: "Todos os campos sao obrigatorios" });
  }

  try {
    const result = await createUser({ name, email, password });

    if (result.error) {
      return res.status(409).json({ error: result.error });
    }

    return res.status(201).json({
      message: "Usuario criado com sucesso",
      user: result.user,
    });
  } catch (error) {
    return res.status(500).json({ error: "Erro ao criar usuario" });
  }
};

// Controla o processo de login a partir de email e senha.
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ error: "Email e senha sao obrigatorios" });
  }

  try {
    const user = await findUserByEmail(email);

    if (!user) {
      return res.status(401).json({ error: "Email ou senha incorretos" });
    }

    const isValid = verifyPassword(password, user.passwordSalt, user.passwordHash);

    if (!isValid) {
      return res.status(401).json({ error: "Email ou senha incorretos" });
    }

    return res.status(200).json({
      message: "Login bem-sucedido",
      user: sanitizeUser(user),
    });
  } catch (error) {
    return res.status(500).json({ error: "Erro ao realizar login" });
  }
};

// Lista os pedidos de um usuário autenticado (usado no perfil dele)
exports.getUserOrders = async (req, res) => {
  try {
    const userId = req.user?.id; // precisa que o middleware de auth injete req.user

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
    return res.status(200).json({ orders });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

