// simulando um "banco de dados" // [até ter o banco de dados]
const users = [];

// criar um novo usuário
const createUser = (user) => {
  const exists = users.find(u => u.email === user.email);
  if (exists) {
    return { error: 'Usuário já existe' };
  }
  users.push(user);
  return user;
};

// retorna todos os usuários
const getUsers = () => users;

module.exports = { createUser, getUsers };
