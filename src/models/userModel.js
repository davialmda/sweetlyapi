// "Banco" de usuários em memória
const users = [];

// Cria um novo usuário
const createUser = (user) => {
  const exists = users.find(u => u.email === user.email);
  if (exists) {
    return { error: 'Usuário já existe' };
  }
  users.push(user);
  return user;
};

// Retorna todos os usuários
const getUsers = () => users;

module.exports = { createUser, getUsers };
