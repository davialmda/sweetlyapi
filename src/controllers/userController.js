// Funções utilitárias que lidam with persistência e segurança de usuários.
const {
  createUser,
  findUserByEmail,
  verifyPassword,
  sanitizeUser,
  getUsers,
} = require("../models/userModel");
const { createLog } = require("./logController");

// Trata a requisição de cadastro de usuário.
exports.registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  // Validação básica para garantir que os campos obrigatórios chegaram.
  if (!name || !email || !password) {
    return res
      .status(400)
      .json({ error: "Todos os campos sao obrigatorios" });
  }

  // Validações adicionais de segurança
  if (typeof name !== 'string' || name.length < 2 || name.length > 100) {
    return res.status(400).json({ error: "Nome deve ter entre 2 e 100 caracteres" });
  }
  
  if (typeof password !== 'string' || password.length < 6) {
    return res.status(400).json({ error: "Senha deve ter pelo menos 6 caracteres" });
  }

  try {
    // Tenta criar o usuário no banco; a função já aplica hash e valida domínio.
    const result = await createUser({ name, email, password });

    if (result.error) {
      return res.status(409).json({ error: result.error });
    }

    // Registra log da criação do usuário
    await createLog(
      'CREATE',
      'User',
      result.user.id,
      `Usuário ${result.user.name} foi criado`,
      null,
      req.ip || req.connection.remoteAddress
    );

    return res.status(201).json({
      message: "Usuario criado com sucesso",
      user: result.user,
    });
  } catch (error) {
    console.error('Erro ao criar usuario:', error);
    return res.status(500).json({ error: "Erro ao criar usuario" });
  }
};

// Controla o processo de login a partir de email e senha.
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

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

    // Registra log do login
    await createLog(
      'LOGIN',
      'User',
      user.id,
      `Usuário ${user.name} fez login`,
      user.id,
      req.ip || req.connection.remoteAddress
    );

    // Retorna somente os dados públicos (sem hash e salt).
    return res.status(200).json({
      message: "Login bem-sucedido",
      user: sanitizeUser(user),
    });
  } catch (error) {
    console.error('Erro ao realizar login:', error);
    return res.status(500).json({ error: "Erro ao realizar login" });
  }
};

// US08 - Lista todos os usuários cadastrados (gerenciar usuários).
exports.listAllUsers = async (req, res) => {
  try {
    const users = await getUsers();

    if (!users || users.length === 0) {
      return res.status(404).json({ message: "Nenhum usuário encontrado" });
    }

    // Registra log da consulta de usuários
    await createLog(
      'VIEW',
      'User',
      null,
      'Lista de usuários foi consultada',
      null,
      req.ip || req.connection.remoteAddress
    );

    return res.status(200).json(users);
  } catch (error) {
    console.error('Erro ao buscar usuarios:', error);
    return res.status(500).json({ error: "Erro ao buscar usuarios" });
  }
};

