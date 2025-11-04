// Model Sequelize responsável por representar pedidos de entrega.
const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const User = require("./user");

// Define os campos persistidos na tabela Orders.
const Order = sequelize.define("Order", {
  item: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [1, 255],
      notEmpty: true,
    },
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
      max: 1000,
    },
  },
  address: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [5, 500],
      notEmpty: true,
    },
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
  status: {
    type: DataTypes.ENUM('pendente', 'em_andamento', 'entregue'),
    allowNull: false,
    defaultValue: 'pendente',
  },
});

// Cria os relacionamentos bidirecionais entre pedidos e usuários.
Order.belongsTo(User, { foreignKey: "userId", as: "user" });
User.hasMany(Order, { foreignKey: "userId", as: "orders" });

module.exports = Order;
