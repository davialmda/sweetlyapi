const express = require("express");
const dotenv = require("dotenv");
const routes = require("./routes/index.js"); // já deve existir
const orderRoutes = require("./routes/orderRoutes"); // rotas de pedidos

// importa a conexão com banco
const sequelize = require("./config/database");

// carrega variáveis de ambiente
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// middlewares para processar JSON e formulário
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// rotas
app.use("/", routes);
app.use("/orders", orderRoutes); // novas rotas de pedidos

// sincroniza banco e inicia servidor
sequelize.sync().then(() => {
  console.log("Banco sincronizado com sucesso!");
  app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
  });
});