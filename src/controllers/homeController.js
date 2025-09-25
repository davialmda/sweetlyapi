// Controller para rota GET
exports.getHome = (req, res) => {
  res.send('Backend rodando via controller!');
};

// Controller para rota POST
exports.postData = (req, res) => {
  const { name, email } = req.body;
  res.send(`Recebido: nome=${name}, email=${email}`);
};
