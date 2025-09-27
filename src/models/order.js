const { DataTypes } = require("sequelize"); // tipos de dados do Sequelize
const sequelize = require("../config/database"); // importa a conexão configurada

// Define o Model "Order" (tabela de pedidos)
const Order = sequelize.define("Order", {
  item: {
    type: DataTypes.STRING, // campo texto (nome do item)
    allowNull: false,       // não pode ser nulo
  },
  quantity: {
    type: DataTypes.INTEGER, // campo numérico (quantidade)
    allowNull: false,       
  },
  address: {
    type: DataTypes.STRING,  // campo texto (endereço de entrega)
    allowNull: false,        
  },
});

module.exports = Order;
