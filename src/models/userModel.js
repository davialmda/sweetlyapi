// Camada de utilidades para lidar com hashing, validação e consultas de usuários.
const crypto = require("crypto");
const User = require("./user");

const PBKDF2_ITERATIONS = 100000;
const KEY_LENGTH = 64;
const DIGEST = "sha512";
const ALLOWED_EMAIL_DOMAINS = new Set(["gmail.com", "outlook.com", "yahoo.com"]);

// Gera hash e salt para a senha informada utilizando PBKDF2.
const hashPassword = (password) => {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto
    .pbkdf2Sync(password, salt, PBKDF2_ITERATIONS, KEY_LENGTH, DIGEST)
    .toString("hex");

  return { salt, hash };
};

// Compara a senha recebida com o hash persistido usando comparação constante.
const verifyPassword = (password, salt, storedHash) => {
  const candidate = crypto
    .pbkdf2Sync(password, salt, PBKDF2_ITERATIONS, KEY_LENGTH, DIGEST)
    .toString("hex");

  const candidateBuffer = Buffer.from(candidate, "hex");
  const hashBuffer = Buffer.from(storedHash, "hex");

  if (candidateBuffer.length !== hashBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(candidateBuffer, hashBuffer);
};

// Remove dados sensíveis antes de devolver o usuário para o cliente.
const sanitizeUser = (userInstance) => {
  const user = userInstance.toJSON();
  delete user.passwordHash;
  delete user.passwordSalt;
  return user;
};

// Extrai o domínio de um endereço de email válido.
const extractDomain = (email) => {
  if (typeof email !== "string") {
    return null;
  }
  const parts = email.split("@");
  if (parts.length !== 2) {
    return null;
  }
  return parts[1].toLowerCase();
};

// Normaliza o email para evitar duplicidades (lowercase + trim).
const normalizeEmail = (email) => (typeof email === "string" ? email.trim().toLowerCase() : "");

// Cria um novo usuário respeitando regras de domínio e unicidade.
const createUser = async ({ name, email, password }) => {
  const normalizedEmail = normalizeEmail(email);
  const domain = extractDomain(normalizedEmail);

  if (!domain || !ALLOWED_EMAIL_DOMAINS.has(domain)) {
    return { error: "Dominio de email nao suportado" };
  }

  const existing = await User.findOne({ where: { email: normalizedEmail } });
  if (existing) {
    return { error: "Usuario ja existe" };
  }

  const { salt, hash } = hashPassword(password);
  const created = await User.create({
    name,
    email: normalizedEmail,
    passwordSalt: salt,
    passwordHash: hash,
  });

  return { user: sanitizeUser(created) };
};

// Retorna uma lista de usuários sem dados sensíveis.
const getUsers = async () => {
  const users = await User.findAll();
  return users.map(sanitizeUser);
};

// Busca um usuário pelo email normalizado.
const findUserByEmail = (email) => {
  const normalizedEmail = normalizeEmail(email);
  return User.findOne({ where: { email: normalizedEmail } });
};

// Recupera um usuário a partir do id primário.
const findUserById = (id) => User.findByPk(id);

module.exports = {
  createUser,
  getUsers,
  findUserByEmail,
  findUserById,
  verifyPassword,
  sanitizeUser,
};
