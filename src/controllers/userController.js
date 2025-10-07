// Funções utilitárias que lidam com persistência e segurança de usuários.
const {
  createUser,
  findUserByEmail,
  verifyPassword,
  sanitizeUser,
} = require("../models/userModel");

// Trata a requisição de cadastro de usuário.
exports.registerUser = async (req, res) => {
  const { name, email, password } = req.body;

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

    // Retorna somente os dados públicos (sem hash e salt).
    return res.status(200).json({
      message: "Login bem-sucedido",
      user: sanitizeUser(user),
    });
  } catch (error) {
    return res.status(500).json({ error: "Erro ao realizar login" });
  }
};
