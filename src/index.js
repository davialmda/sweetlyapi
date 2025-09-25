const express = require('express');
const dotenv = require('dotenv');
const routes = require('./routes/index.js');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// middleware para processar o JSON
app.use(express.json());  // o express entende os dados em JSON na requisição
app.use(express.urlencoded({ extended: true }));

// Rotas
app.use('/', routes);

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
