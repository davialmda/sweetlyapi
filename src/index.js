const express = require('express');
const dotenv = require('dotenv');
const routes = require('./routes/index.js');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para processar JSON
app.use(express.json());  // Aqui o Express vai ser capaz de entender os dados em JSON no corpo da requisição
app.use(express.urlencoded({ extended: true }));

// Rotas
app.use('/', routes);

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
