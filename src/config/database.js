const { Sequelize } = require("sequelize"); // importa o Sequelize (ORM)
const path = require("path"); // módulo do Node para lidar com caminhos de arquivos

// Cria a conexão com banco SQLite
const sequelize = new Sequelize({
  dialect: "sqlite", // define que o banco usado é o SQLite
  storage: path.resolve(__dirname, "../../database.sqlite"), // caminho do arquivo físico do banco
  logging: false, // desativa logs SQL automáticos do Sequelize (para não poluir o terminal)
});

// Exporta a conexão para ser usada nos models
module.exports = sequelize;