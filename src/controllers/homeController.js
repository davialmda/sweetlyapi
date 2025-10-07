// Handler simples usado para testar se o backend está respondendo.
exports.getHome = (req, res) => {
  res.send('Backend rodando via controller!');
};

// Exemplifica leitura de dados enviados via POST e devolve uma resposta amigável.
exports.postData = (req, res) => {
  const { name, email } = req.body;
  res.send(`Recebido: nome=${name}, email=${email}`);
};
