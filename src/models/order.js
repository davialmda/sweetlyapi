// Model Sequelize responsável por representar pedidos de entrega.
const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const User = require("./user");

// Define os campos persistidos na tabela Orders.
const Order = sequelize.define("Order", {
  item: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  address: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: "id",
    },
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  },
});

// Cria os relacionamentos bidirecionais entre pedidos e usuários.
Order.belongsTo(User, { foreignKey: "userId", as: "user" });
User.hasMany(Order, { foreignKey: "userId", as: "orders" });

module.exports = Order;
