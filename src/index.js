// Ponto de entrada do servidor Express.
const express = require("express");
const dotenv = require("dotenv");
const routes = require("./routes/index.js");
const userRoutes = require("./routes/userRoutes");
const orderRoutes = require("./routes/orderRoutes");
const sequelize = require("./config/database");

// Carrega variáveis do arquivo .env.
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares para ler JSON e dados de formulários.
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS para permitir requisições do frontend
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// Organização das rotas principais.
app.use("/", routes);
app.use("/", userRoutes);
app.use("/orders", orderRoutes);

// Sincroniza os models e inicia o servidor HTTP.
sequelize.sync({ alter: true }).then(() => {
  console.log("Banco sincronizado com sucesso!");
  app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
  });
});
